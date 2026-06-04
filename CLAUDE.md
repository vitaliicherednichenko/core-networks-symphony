# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Symfony 7.4 (LTS) full web application (Twig, Doctrine ORM, forms, web profiler,
AssetMapper) running entirely in Docker. Nothing PHP-related is installed on the host —
all PHP/Composer/console work happens inside the `php` container.

## Stack & containers (`compose.yaml`)

- **php** — PHP 8.4 FPM, built from `docker/php/Dockerfile` (Composer baked in). The whole
  project is bind-mounted at `/var/www/html`. Runs as `www-data` remapped to the host
  UID/GID (build args `UID`/`GID`) so files written from the container stay host-owned.
- **nginx** — `nginx:alpine`, serves `public/` and proxies `*.php` to `php:9000`
  (config: `docker/nginx/default.conf`). Published on **http://localhost:8080**.
- **database** — `mysql:8.4`, data in the named volume `database_data`. Published on host
  port **3307** (→ 3306 in-container). Has a healthcheck; `php` and `phpmyadmin` wait for it.
- **phpmyadmin** — `phpmyadmin:5`, talks to `database:3306`. Published on **http://localhost:8081**.

Default credentials (overridable via env vars consumed by `compose.yaml`):
`MYSQL_DATABASE=app`, `MYSQL_USER=app`, `MYSQL_PASSWORD=app`, `MYSQL_ROOT_PASSWORD=root`.

## Database connection

Doctrine reads `DATABASE_URL`. The runtime value is injected into the `php` service in
`compose.yaml` and points at the `database` host (NOT 127.0.0.1):
`mysql://app:app@database:3306/app?serverVersion=8.4&charset=utf8mb4`.
The same default is committed in `.env`. When changing DB name/user/password, update both
the `compose.yaml` env defaults and this URL's `serverVersion`.

## Common commands

Start / stop the stack (the `UID`/`GID` exports keep file ownership correct on rebuilds):

```bash
UID=$(id -u) GID=$(id -g) docker compose up -d --build   # build + start
docker compose ps                                        # status
docker compose logs -f php                               # tail a service
docker compose down                                      # stop (keeps DB volume)
docker compose down -v                                   # stop + wipe DB volume
```

Run Symfony console / Composer / tests inside the `php` container:

```bash
docker compose exec php php bin/console <command>        # e.g. cache:clear, debug:router
docker compose exec php composer require <package>
docker compose exec php php bin/phpunit                  # full test suite
docker compose exec php php bin/phpunit tests/SomeTest.php            # single file
docker compose exec php php bin/phpunit --filter testMethodName       # single test
```

Doctrine workflow:

```bash
docker compose exec php php bin/console make:entity
docker compose exec php php bin/console make:migration
docker compose exec php php bin/console doctrine:migrations:migrate
docker compose exec php php bin/console dbal:run-sql "SELECT 1"       # quick DB check
```

## Conventions / gotchas

- **PHP version is pinned to 8.4.** `composer.lock` was resolved against PHP 8.4 (a dev
  dependency requires `>= 8.4.0`), enforced by `vendor/composer/platform_check.php`. The
  `php` image FROM must stay `php:8.4-*` or the app 500s on a platform check. Bump both
  together if upgrading.
- **MakerBundle's `--no-interaction` flag is broken here** (throws on `$controller`). Run
  maker interactively, or hand-write controllers/entities (see `src/Controller/HomeController.php`).
- Add PHP extensions by appending to the `install-php-extensions` line in
  `docker/php/Dockerfile`, then `docker compose up -d --build php`.
- This directory is not a git repo yet — run `git init` if you want version control.
