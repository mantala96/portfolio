# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

PayloadCMS v3 (Next.js 16) — admin panel + REST API backed by PostgreSQL. Powers the personal portfolio website (`../website`) which fetches all content via the REST API.

## Running with Docker (recommended)

All three services (postgres, cms, website) are orchestrated from the project root:

```bash
# from project root (../):
docker compose up --build        # start all services with hot reload
docker compose up --build cms    # rebuild only CMS
docker compose down              # stop all services
docker compose down -v           # stop and wipe DB volumes
```

Services:
- CMS admin: http://localhost:3000/admin
- REST API:  http://localhost:3000/api/*
- PostgreSQL: localhost:5432

Environment variables are set in `docker-compose.yml` — no `.env.local` needed for Docker.

## Running locally (without Docker)

### Prerequisites

- Node.js 20 LTS or 22 LTS (**not odd-numbered releases** — tsx ESM loader is unstable on v25+)
- PostgreSQL 14+ running locally
- pgAdmin (used for running SQL — **not psql**; always provide plain SQL without heredoc syntax)

Run only PostgreSQL via Docker if needed:
```bash
docker compose up postgres
```

### First-time setup

```bash
# 1. Create the DB (Czech locale for correct á, č, ě, ř, š, ž sorting)
#    Run in pgAdmin as postgres:
#    CREATE DATABASE cms_db ENCODING 'UTF8' LC_COLLATE 'cs_CZ.utf8' LC_CTYPE 'cs_CZ.utf8' TEMPLATE template0;

# 2. Create the dedicated app user — run sql/local-setup.sql in pgAdmin against cms_db

# 3. Configure environment
cp .env.example .env.local
#    DATABASE_URL=postgresql://cms_app:cms_app_secret@localhost:5432/cms_db
#    PAYLOAD_SECRET=any-long-random-string

# 4. Install dependencies
npm install

# 5. Start dev server
npm run dev   # → http://localhost:3000/admin
```

On first visit, Payload prompts to create the first admin user.

### Subsequent starts

```bash
npm run dev
```

## Other commands

```bash
npm run build                # production build
npm run generate:types       # regenerate payload-types.ts after schema changes
npm run generate:importmap   # regenerate importMap after adding custom components
```

## Architecture

PayloadCMS v3 runs as a Next.js app. Two route groups:

- `app/(payload)/api/[...slug]/route.ts` — REST API
- `app/(payload)/admin/[[...segments]]/page.tsx` — admin UI
- `app/(app)/page.tsx` — root redirect to `/admin`

The `app/(payload)/layout.tsx` uses Payload's `RootLayout` with a `serverFunction` server action (required for server-side operations like form submissions and live preview).

Schema is synced to the DB automatically in dev via `push: true` on the postgres adapter. **Remove `push` in production and use migrations instead.**

## Collections

| Slug | Purpose |
|---|---|
| `users` | Admin users — auth enabled |
| `media` | File uploads (PDF, images) — served at `/media/*` from `public/media/` |
| `experience` | Work history entries with role, company, dates, achievements |

## Globals

| Slug | Purpose |
|---|---|
| `personal-info` | Name, role, tagline, bio, email, LinkedIn, GitHub, resume (upload) |
| `skills` | Grouped skill categories (Cloud, DevOps, CI/CD, etc.) |

## Key files

| File | Purpose |
|---|---|
| `payload.config.ts` | Master config — DB, collections, globals, CORS, upload limits |
| `src/collections/Users.ts` | Admin users (auth enabled) |
| `src/collections/Media.ts` | Upload collection — PDF + images, stored in `public/media/` |
| `src/collections/Experience.ts` | Work history — role, company, dates, achievements[], order |
| `src/globals/PersonalInfo.ts` | Singleton — name, role, tagline, bio, contact links, resume upload |
| `src/globals/Skills.ts` | Singleton — array of { category, items[] } skill groups |
| `app/(payload)/layout.tsx` | Payload admin layout — `RootLayout` + `serverFunction` server action |
| `next.config.mjs` | `output: 'standalone'` for production Docker |
| `sql/local-setup.sql` | Plain SQL (pgAdmin) — creates cms_app user + schema ownership |

## Access control

- `media`, `experience` collections: `read: () => true` (public REST API)
- `personal-info`, `skills` globals: `read: () => true` (public REST API)
- All write operations require authentication

## Extending

- **New collection** → create `src/collections/MyThing.ts`, add to `collections[]` in `payload.config.ts`, run `npm run generate:types`
- **New global** → create `src/globals/MyGlobal.ts`, add to `globals[]` in `payload.config.ts`
- **New upload field** → use `type: 'upload', relationTo: 'media'`
- After adding custom components: run `npm run generate:importmap`

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection — use `cms_app` role: `postgresql://cms_app:cms_app_secret@postgres:5432/cms_db` |
| `PAYLOAD_SECRET` | Long random string — signs JWTs and encrypts data |
| `NEXT_PUBLIC_SERVER_URL` | Public URL of this CMS (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_WEBSITE_URL` | Website origin added to CORS allowlist |

## Production Docker build

```bash
# from cms/ directory:
docker build --target runner -t cms:prod .
docker run -p 3000:3000 \
  -e DATABASE_URL=... \
  -e PAYLOAD_SECRET=... \
  -e NEXT_PUBLIC_SERVER_URL=... \
  cms:prod
```
