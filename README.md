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

## License

Private — Tiqani
