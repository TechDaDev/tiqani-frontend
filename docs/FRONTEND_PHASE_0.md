# Frontend Phase 0 — Next.js Foundation

## Status

Phase 0 is complete. This document describes what was built and how to use it.

## Next.js Setup

- App Router with locale-prefixed routes
- TypeScript strict mode
- Tailwind CSS 3 with design tokens
- ESLint with Next.js config
- Environment-based API configuration

## Folder Structure

```
app/
  [locale]/          Locale-prefixed routes
    layout.tsx       Root layout with theme, i18n, fonts
    page.tsx         Landing page
    loading.tsx      Loading state
    error.tsx        Error boundary
    not-found.tsx    404 page
  layout.tsx         Minimal root layout
  page.tsx           Locale detection and redirect
  globals.css        Design tokens and base styles
  sitemap.ts         Multilingual sitemap
  robots.ts          Robots configuration

components/
  layout/            Public header, footer, mobile nav
  controls/          Theme and language switchers
  landing/           Landing page sections
  shared/            Reusable shared components
  ui/                Primitive UI components

lib/
  api/               API client, health check
  i18n/              i18n routing, request config
  utils.ts           Utility functions

hooks/               Custom React hooks
types/               TypeScript types
messages/            Translation files (en, ar, ku)
```

## Route Architecture

- `/ar` — Arabic (RTL) — **default**
- `/en` — English (LTR)
- `/ku` — Sorani Kurdish (RTL)
- `/` — Reads locale cookie, redirects to Arabic by default

## Development

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run test       # Vitest
```

## Environment Variables

See `.env.example`.

## Phase 0 Limitations

- No authentication
- No dashboards
- No chat
- No contracts
- No wallet
- No admin
- No private API endpoints
- Technician preview uses development-only fixtures
- Categories are static content

## Phase 1 Integration Points

- Replace static categories with API data
- Replace development technician fixtures
- Implement authentication routes
- Connect marketplace endpoints
