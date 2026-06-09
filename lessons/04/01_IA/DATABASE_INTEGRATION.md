# Connecting the Angular front to the local database — how it was done

This document describes how the AI assistant connected the Angular frontend to the
local MySQL database (the `sistema_reservaciones` data), the architecture it used,
and the options it offered along the way.

---

## 1. The goal

Display — and later edit — the data from
[`lessons/02/sistema_reservaciones.sql`](lessons/02/sistema_reservaciones.sql)
inside the Angular single-page app, reading it live from the MySQL database that
runs in Docker (visible in phpMyAdmin).

## 2. What was already in place

Before any code was written, the assistant inspected the project and found:

- A **Docker stack** (from `compose.yaml`): `php` (Symfony 7.4), `nginx` (port 8080),
  `database` (MySQL 8.4, host port 3307), and `phpmyadmin` (port 8081).
- An **Angular app** in `frontend/` with a working API-call pattern already wired:
  a `PingController` on the Symfony side, an `ApiService` on the Angular side, and a
  dev-server proxy (`frontend/proxy.conf.json`) forwarding `/api` → `http://localhost:8080`.
- **The data was already imported.** The `sistema_reservaciones` tables
  (`vuelos`, `pasajeros`, `reservas_vuelos`, `boletos`, `detalles_viajeros`,
  `itinerarios`, `listado_pasajeros_vuelos`, `tarjeta_de_embarque`) already lived
  inside the **`app`** database — the same database Doctrine connects to. So **no SQL
  import was necessary**; the work was purely about exposing and editing that data.

## 3. How the connection works (architecture)

The browser never talks to MySQL directly. Each request flows through four layers:

```
Angular (ng serve, :4200)
   │  HTTP GET/POST/PUT/DELETE  /api/...
   ▼
proxy.conf.json   ── forwards /api → http://localhost:8080  (avoids CORS in dev)
   ▼
nginx (:8080)  ──►  Symfony / PHP-FPM
   ▼
Doctrine DBAL connection  (DATABASE_URL → mysql://app:app@database:3306/app)
   ▼
MySQL (:3306 in-container, :3307 on host)
```

Key facts about the connection itself:

- Symfony reads **`DATABASE_URL`** (injected in `compose.yaml`, default also committed
  in `.env`): `mysql://app:app@database:3306/app`. It points at the Docker service
  host `database`, **not** `127.0.0.1`.
- On the Symfony side the assistant used the **Doctrine DBAL `Connection`** directly
  (`fetchAllAssociative`, `insert`, `update`, `delete`) instead of generating ORM
  entities. This was deliberate: the tables already existed with data, so raw,
  parameterised SQL was the fastest safe way to read/write them without scaffolding
  eight entities and a migration.
- During local development the **Angular proxy** removes the need for CORS headers:
  the frontend calls a relative `/api/...` URL and the proxy adds the origin.

## 4. What was built, step by step

The work was delivered iteratively, each step adding one capability:

| Step | What was added |
|------|----------------|
| 1 | **Read 3 main tables.** A `ReservacionesController` with `GET /api/vuelos`, `/api/pasajeros`, `/api/reservas`; Angular `ApiService` methods + typed interfaces; three tables rendered in `app.component`. |
| 2 | **Added `boletos`**, joined to `pasajeros` so each ticket shows the passenger's name instead of a bare ID. |
| 3 | **Added the remaining 4 tables** (`detalles_viajeros`, `itinerarios`, `listado_pasajeros_vuelos`, `tarjeta_de_embarque`) — all 8 tables now displayed. Link/junction tables were `LEFT JOIN`ed to show readable names and flight routes rather than foreign-key IDs. |

## 5. Options the AI offered

Throughout the work the assistant surfaced explicit choices rather than assuming:

### Read display
- **Raw columns vs. enriched joins.** For the link tables it offered (and applied)
  `LEFT JOIN`s so the UI shows passenger names and flight routes instead of opaque IDs.

### Operational options offered
- **Starting / stopping the dev server** (`npm start` on :4200; stop via `Ctrl+C` or
  `lsof -ti :4200 | xargs kill`), kept separate from the Docker stack
  (`docker compose up -d` / `down`).
- **Committing the frontend files** — these live under `frontend/` and are **untracked
  by git**, so they were repeatedly reverted by the environment; the assistant offered
  to commit them so the work would persist (offer still open).

## 6. Files involved

Current (read-only) state:

- Backend: [`src/Controller/Api/ReservacionesController.php`](src/Controller/Api/ReservacionesController.php)
  — eight `GET` endpoints over the Doctrine DBAL connection, with joins for the link tables.
- Frontend:
  - [`frontend/src/app/api.service.ts`](frontend/src/app/api.service.ts) — typed interfaces + fetch methods.
  - [`frontend/src/app/app.component.ts`](frontend/src/app/app.component.ts) — loads all 8 tables into signals.
  - [`frontend/src/app/app.component.html`](frontend/src/app/app.component.html) — renders the 8 tables.
  - [`frontend/src/app/app.component.css`](frontend/src/app/app.component.css) — centered layout + table styling.
  - [`frontend/proxy.conf.json`](frontend/proxy.conf.json) — `/api` → Symfony proxy.

## 7. How to run and verify

```bash
# 1. Backend stack (MySQL + Symfony + nginx + phpMyAdmin)
UID=$(id -u) GID=$(id -g) docker compose up -d --build

# 2. Frontend dev server
cd frontend && npm start            # serves http://localhost:4200

# 3. Quick API check (through the proxy)
curl http://localhost:4200/api/vuelos
```

- App: **http://localhost:4200**
- Symfony API directly: **http://localhost:8080/api/vuelos**
- phpMyAdmin: **http://localhost:8081**

All API responses are UTF-8 (accented Spanish names such as *García*, *López* come
through correctly).
