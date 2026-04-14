# CLAUDE.md

Portfolio monorepo — PayloadCMS v3 (Next.js) backend + React/Vite frontend, served via nginx reverse proxy, backed by PostgreSQL. All services run in Docker.

```
portfolio/
  cms/          PayloadCMS v3 — admin UI + REST API
  frontend/     React 19 + Vite 6 — portfolio SPA
  nginx/        Reverse proxy + SSL termination
  postgres/     pg_hba.conf for local Docker
  docker-compose.yml   Production orchestration
```

---

## Running locally (without Docker)

### Prerequisites
- Node.js 20 LTS
- PostgreSQL 14+ running locally (or via `docker run -e POSTGRES_PASSWORD=... -p 5432:5432 postgres:18`)

### CMS
```bash
cd cms
cp .env.example .env.local   # fill in DATABASE_URL + secrets
npm install
npm run dev                  # → http://localhost:3000/admin
```
First visit: Payload prompts to create the first admin user.

### Frontend
```bash
cd frontend
npm install
npm run dev                  # → http://localhost:5173
```
`VITE_CMS_URL` defaults to `http://localhost:3000` — no `.env.local` needed unless CMS runs elsewhere.

---

## Running with Docker (production compose)

All services are in `docker-compose.yml`. Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
# edit .env — see "Environment variables" section below

docker compose -f docker-compose.yml up -d
```

Services:
| Service   | Internal host | Exposed |
|-----------|--------------|---------|
| postgres  | postgres:5432 | 5432 |
| cms       | cms:3000      | — (nginx proxies) |
| frontend  | frontend:80   | — (nginx proxies) |
| nginx     | —             | 80, 443 |

SSL certificates are issued automatically via certbot on first start.

---

## CI/CD (GitHub Actions → VPS)

Workflow: `.github/workflows/docker-build.yml`

On push to `main`:
1. Builds and pushes three Docker images to GHCR
2. SSHs into the VPS and runs `docker compose -f docker-compose.yml pull && up -d`

### GitHub Actions Secrets required

| Secret | Value |
|--------|-------|
| `CMS_URL` | `https://cms.yourdomain.com` |
| `WEBSITE_URL` | `https://yourdomain.com` |
| `VPS_HOST` | VPS IP or hostname |
| `VPS_USER` | SSH username |
| `VPS_SSH_KEY` | SSH private key (full contents) |
| `GHCR_PAT` | GitHub PAT with `read:packages` (used on VPS to pull images) |

`GITHUB_TOKEN` is automatic — no secret needed for pushing images.

### VPS `.env` file

The deploy step runs `docker compose` on the VPS, which reads `/docker/portfolio/.env`:

```env
GITHUB_USERNAME=your-github-username

POSTGRES_PASSWORD=strong-random-password
PAYLOAD_SECRET=long-random-string-min-32-chars

CMS_URL=https://cms.yourdomain.com
WEBSITE_URL=https://yourdomain.com

DOMAIN=yourdomain.com
CMS_DOMAIN=cms.yourdomain.com
CERTBOT_EMAIL=your@email.com
```

---

## Environment variables reference

### CMS runtime (injected by docker-compose / .env.local)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Signs JWTs — must be stable across deployments |
| `CMS_SERVER_URL` | Public CMS URL — used for Payload `serverURL` + CORS |
| `CMS_WEBSITE_URL` | Frontend URL — added to CORS allowlist |

### CMS build-time (baked into Next.js bundle)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SERVER_URL` | CMS URL for Payload admin UI client-side code |
| `NEXT_PUBLIC_WEBSITE_URL` | Frontend URL (build-time reference) |

### Frontend build-time (baked into Vite bundle)

| Variable | Purpose |
|----------|---------|
| `VITE_CMS_URL` | CMS base URL — must be set at build time, falls back to `http://localhost:3000` |

---

## CMS architecture

PayloadCMS v3 on Next.js App Router.

**Collections**
| Slug | Purpose |
|------|---------|
| `users` | Admin users — auth enabled |
| `media` | File uploads (PDF, images) — served from `public/media/` |
| `experience` | Work history — role, company, dates, achievements |

**Globals**
| Slug | Purpose |
|------|---------|
| `personal-info` | Name, role, tagline, bio, contact links, resume |
| `skills` | Grouped skill categories |

Access control: all collections/globals are publicly readable. Writes require auth.

Schema auto-syncs to DB in dev (`push: true`). In production, use migrations.

**Key files**
| File | Purpose |
|------|---------|
| `payload.config.ts` | Master config — DB, collections, globals, CORS |
| `src/collections/` | Collection definitions |
| `src/globals/` | Global definitions |
| `next.config.mjs` | `output: 'standalone'` for Docker |

**Extending**
- New collection → `src/collections/MyThing.ts` → add to `payload.config.ts` → `npm run generate:types`
- New global → `src/globals/MyGlobal.ts` → add to `payload.config.ts`

---

## Frontend architecture

React 19 + Vite 6 SPA. No client-side router — one scrollable page.

**Data flow:** `App.tsx` fetches `personal-info`, `skills`, `experience` from CMS on mount → passes as props to section components.

**CMS endpoints used**
| Endpoint | Component |
|----------|-----------|
| `GET /api/globals/personal-info` | Hero, About, Contact |
| `GET /api/globals/skills` | Skills |
| `GET /api/experience?sort=order` | Experience |

**Key files**
| File | Purpose |
|------|---------|
| `src/App.tsx` | Root — fetches data, composes sections |
| `src/lib/cms.ts` | All fetch helpers + TypeScript interfaces |
| `src/index.css` | Design system (CSS custom properties, no Tailwind) |

**Extending**
- New section → `src/components/MySection.tsx` → add fetch in `src/lib/cms.ts` → wire in `App.tsx`
- New CMS field → update interface in `src/lib/cms.ts`

---

## nginx

Terminates SSL via Let's Encrypt certbot. Proxies:
- `yourdomain.com` → `frontend:80`
- `cms.yourdomain.com` → `cms:3000`

Cookie fix: `proxy_cookie_flags ~ secure samesite=none;` on the CMS location ensures `payload-token` gets `Secure; SameSite=None` flags (nginx terminates SSL so the app sees HTTP internally).

Config template: `nginx/nginx.conf.template` — variables substituted by `nginx/entrypoint.sh` at container start.

---

## Common commands

```bash
# Regenerate Payload types after schema changes
cd cms && npm run generate:types

# Rebuild a single service
docker compose -f docker-compose.yml up -d --build cms

# Wipe DB and start fresh
docker compose -f docker-compose.yml down -v
```
