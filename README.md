# Tiqani Frontend

A Next.js multilingual platform connecting clients with verified technical professionals.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3
- **Internationalization**: next-intl
- **Theme**: next-themes (light/dark/system)
- **Testing**: Vitest + React Testing Library
- **Icons**: Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=ar
NEXT_PUBLIC_APP_NAME=Tiqani
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type check |
| `npm run test` | Run Vitest tests |
| `npm run test:watch` | Run tests in watch mode |

## Supported Locales

- `/ar` — Arabic (RTL) — **default**
- `/en` — English (LTR)
- `/ku` — Sorani Kurdish (RTL)

## Locale Selection

1. Saved locale cookie (NEXT_LOCALE)
2. Arabic fallback (default)

## Auth

See [docs/FRONTEND_PHASE_1.md](docs/FRONTEND_PHASE_1.md) and [docs/AUTH_API_MAPPING.md](docs/AUTH_API_MAPPING.md).

## Project Structure

```
app/              App Router pages and layouts
components/       Reusable UI components
lib/              Utilities, API client, i18n config
hooks/            Custom React hooks
messages/         Translation files (en, ar, ku)
docs/             Documentation
```

## Phase 0

This is the foundational phase. See [docs/FRONTEND_PHASE_0.md](docs/FRONTEND_PHASE_0.md) for details.

## Phase 2 — Role-Aware Profiles

- **Branch:** `frontend/phase-2-2-completion`
- **Backend:** `backend/phase-2-profile-integration` (commit `51d8d0c`)

### Key additions
- Role-based navigation shell (AuthShell)
- Client profile editing (GET/PATCH /api/client/me)
- Technician profile editing (GET/PATCH /api/technicians/me)
- Technician skills management (GET/PATCH /api/technicians/me/skills)
- Technician availability toggle (GET/PATCH /api/technicians/me/availability)
- Technician ratings display (GET /api/technicians/me/ratings)
- Technician portfolio images (GET/POST /api/technicians/me/images)
- Profile completion tracking (GET /api/profile/incomplete-fields)
- Technician onboarding flow based on backend completion state
- Server-side role guards for page and API protection

### Documentation
- [docs/FRONTEND_PHASE_2.md](docs/FRONTEND_PHASE_2.md) — Complete Phase 2 documentation
- [docs/PROFILE_API_MAPPING.md](docs/PROFILE_API_MAPPING.md) — API endpoint reference
- [docs/ROLE_ARCHITECTURE.md](docs/ROLE_ARCHITECTURE.md) — Role-based access control
- [docs/TECHNICIAN_ONBOARDING.md](docs/TECHNICIAN_ONBOARDING.md) — Onboarding model
- [docs/PROTECTED_ROUTES.md](docs/PROTECTED_ROUTES.md) — Route protection architecture
- [docs/PHASE_2_BACKEND_FINDINGS.md](docs/PHASE_2_BACKEND_FINDINGS.md) — Backend integration findings

## Phase 11 — Reviews, Reputation, Notifications, Trust

- **Branch:** `frontend/phase-11-reviews-notifications-trust`
- **Backend:** `backend/phase-11-reviews-notifications-trust`

### Key additions
- Contract review creation and eligibility UI
- Public user reputation and review display
- In-app notification center, unread state, and preferences
- Staff review report moderation screens
- Same-origin proxy routes for review, reputation, notification, and moderation APIs

### Final validation
- `npm run lint`: passed with existing warnings
- `npx tsc --noEmit`: passed
- `npx vitest run`: 559 passed
- `npm run build`: passed, 47 static pages generated
- `npm audit`: passed, 0 vulnerabilities
- Full Playwright regression: 371 passed in 27.2m

### Documentation
- [docs/PHASE_11_FRONTEND.md](docs/PHASE_11_FRONTEND.md) — Complete Phase 11 frontend documentation

## License

Private — Tiqani
