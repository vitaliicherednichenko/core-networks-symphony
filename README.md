# Core Networks Symphony

Sistema de reservaciones de vuelos: una API REST en Symfony con una interfaz
en Angular, todo orquestado con Docker. Incluye gestión de vuelos, reservas,
pasajeros, boletos, tarjetas de embarque, itinerarios y usuarios, con control
de acceso por roles (admin / usuario), internacionalización (ES/EN) y
temperatura en tiempo real de origen/destino para cada vuelo (vía Open-Meteo).

<img width="1179" height="774" alt="core-networks-symphony" src="https://github.com/user-attachments/assets/f97852bc-1ad8-4aa5-9c3b-90c2f817225f" />

## Tecnologías

### Backend
- **PHP 8.4** + **Symfony 7.4 (LTS)**
- **Doctrine ORM** / DBAL (migraciones, acceso a datos)
- **MySQL 8.4**
- Twig, AssetMapper, Web Profiler
- **Open-Meteo API** — temperatura en tiempo real de origen/destino de cada vuelo

### Frontend
- **Angular 19** (componentes standalone, signals, `@if`/`@for`)
- **Angular Material** + **Bootstrap 5**
- **@angular/localize** — i18n en tiempo de compilación (es/en)
- RxJS, TypeScript

### Infraestructura
- **Docker Compose** — todos los servicios corren en contenedores
  - `php` (PHP-FPM 8.4 + Composer)
  - `nginx` — sirve la app y proxea a PHP
  - `database` (MySQL 8.4)
  - `phpmyadmin`

## Arquitectura

```
┌─────────────┐      /api/*      ┌──────────────┐      SQL      ┌──────────┐
│  Angular    │ ───────────────► │   Symfony    │ ─────────────► │  MySQL   │
│  (frontend) │ ◄─────────────── │  (backend)   │ ◄───────────── │          │
└─────────────┘      JSON        └──────────────┘                └──────────┘
```

El backend Symfony expone una API REST bajo `/api`. El frontend Angular
consume esa API y se sirve por separado (dev server de Angular o un build
estático), con `/api` proxeado hacia el backend.

## Funcionalidades

### Temperatura de origen y destino

Cada vuelo muestra la temperatura actual de su aeropuerto de origen y de
destino, calculada a partir de las coordenadas (`origen_lat`/`origen_lon` y
`destino_lat`/`destino_lon`) guardadas en cada vuelo.

- El backend expone `GET /api/clima?lat=&lon=`
  ([`ClimaController`](src/Controller/Api/ClimaController.php)), que consulta
  la API pública y gratuita de [Open-Meteo](https://open-meteo.com/) y
  devuelve la temperatura actual (`temperature_2m`) junto a su unidad.
- El frontend (página de Vuelos y la tabla de inicio) pide el clima de cada
  coordenada única tras cargar los vuelos y cachea el resultado en memoria
  por coordenada, para no repetir peticiones.
- Si un vuelo no tiene coordenadas registradas, o la consulta al clima falla,
  se muestra `—` en lugar de la temperatura.

## Puesta en marcha

### Backend (Docker)

```bash
UID=$(id -u) GID=$(id -g) docker compose up -d --build
```

| Servicio    | URL                        |
|-------------|-----------------------------|
| App (nginx) | http://localhost:8080       |
| phpMyAdmin  | http://localhost:8081       |
| MySQL       | localhost:3307               |

Comandos útiles:

```bash
docker compose exec php php bin/console doctrine:migrations:migrate
docker compose exec php php bin/phpunit
docker compose logs -f php
docker compose down            # detiene los contenedores (conserva el volumen de datos)
```

### Frontend (Angular)

```bash
cd frontend
npm install
npm start                # dev server en español, con recarga en caliente
```

Para previsualizar ambos idiomas (build estático, sin recarga en caliente):

```bash
npm run build:i18n        # compila es + en
npm run serve:i18n        # los sirve en http://localhost:4300/ (/es/, /en/)
```

## Estructura del proyecto

```
src/Controller/Api/   # Controladores de la API REST (uno por entidad)
migrations/            # Migraciones de Doctrine
frontend/src/app/      # Componentes Angular (uno por sección/entidad)
frontend/src/locale/   # Archivos de traducción (XLIFF)
docker/                # Dockerfiles y configuración de nginx
```
