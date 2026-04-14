# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

React 19 + Vite 6 personal portfolio website. Single-page app — all content is fetched from the PayloadCMS instance (`../cms`) via its REST API and rendered client-side. Czech language UI.

## Running with Docker (recommended)

All three services (postgres, cms, website) are orchestrated from the project root:

```bash
# from project root (../):
docker compose up --build         # start all services with hot reload
docker compose up --build website # rebuild only website
docker compose down
```

Website: http://localhost:5173

Environment variables are set in `docker-compose.yml` — no `.env.local` needed for Docker.

## Running locally (without Docker)

### Prerequisites

- Node.js 20+
- CMS must be running at localhost:3000 (locally or via Docker)

### First-time setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev   # → http://localhost:5173
```

`VITE_CMS_URL` defaults to `http://localhost:3000` — only set it in `.env.local` if CMS runs elsewhere.

### Subsequent starts

```bash
npm run dev
```

## Other commands

```bash
npm run build     # type-check + Vite production build → dist/
npm run preview   # serve the production build locally
npm run lint
```

## Architecture

Single-page application — no client-side router. All sections are rendered on one scrollable page.

```
src/
  App.tsx                     Entry — fetches all CMS data, renders all sections
  index.css                   Global styles — CSS custom properties design system
  lib/cms.ts                  CMS API client — typed fetch helpers + TypeScript interfaces
  components/
    Nav.tsx                   Fixed top navbar with IntersectionObserver scroll-spy
    Hero.tsx                  Full-height hero — name, role, tagline, CTA
    About.tsx                 Bio text + stats card
    Skills.tsx                Skill groups (from CMS) with tag pills; falls back to hardcoded defaults
    Experience.tsx            Vertical timeline of work history
    Contact.tsx               Email link, GitHub, LinkedIn, CV download
  pages/
    PageTemplate.tsx          Legacy — slug-based CMS page renderer (not used in main app)
```

**Data flow:**
`App.tsx` calls `Promise.all([fetchPersonalInfo, fetchSkills, fetchExperience])` on mount → passes data as props to each section component.

## CMS data sources

| Endpoint | Used by | Type |
|---|---|---|
| `GET /api/globals/personal-info` | Hero, About, Contact | Global |
| `GET /api/globals/skills` | Skills | Global |
| `GET /api/experience?sort=order` | Experience | Collection |

## Design system (`src/index.css`)

CSS custom properties — no Tailwind, no CSS modules:

| Variable | Value | Use |
|---|---|---|
| `--bg` | `#0a0e1a` | Page background |
| `--bg-2` | `#0f1525` | Alternating section background |
| `--card` | `#111827` | Card backgrounds |
| `--accent` | `#6366f1` | Indigo — primary accent |
| `--text` | `#f1f5f9` | Primary text |
| `--muted` | `#94a3b8` | Secondary text |
| `--border` | `#1e293b` | Borders |

Font: **Inter** loaded from Google Fonts in `index.html`.

## Key files

| File | Purpose |
|---|---|
| `src/App.tsx` | Root component — data fetching + page composition |
| `src/lib/cms.ts` | All API fetch logic and TypeScript interfaces (PersonalInfo, Skills, Experience, MediaFile) |
| `src/index.css` | Full design system — tokens, reset, layout utilities, component styles |
| `index.html` | Entry HTML — Inter font, SVG favicon, meta description |
| `public/favicon.svg` | SVG favicon — dark bg + indigo "M" |
| `Dockerfile` | Multi-stage: `dev` (Vite HMR) + `runner` (nginx static) |
| `nginx.conf` | nginx config for production — SPA fallback to `index.html` |
| `vite.config.ts` | `server.host: true` binds to 0.0.0.0 for Docker |

## Extending

- **New section** → create `src/components/MySection.tsx`, add fetch helper to `src/lib/cms.ts`, wire up in `App.tsx`
- **New CMS field** → update the relevant TypeScript interface in `src/lib/cms.ts`
- **Skills fallback** → `Skills.tsx` has hardcoded default groups shown when CMS returns empty — update `FALLBACK_GROUPS` there

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_CMS_URL` | Base URL of the CMS (default: `http://localhost:3000`) |

> **Production note:** `VITE_CMS_URL` is baked into the JS bundle at build time. Pass as build arg:
> `docker build --build-arg VITE_CMS_URL=https://cms.example.com --target runner .`

## Production Docker build

```bash
# from website/ directory:
docker build --build-arg VITE_CMS_URL=https://cms.example.com --target runner -t website:prod .
docker run -p 80:80 website:prod
```
