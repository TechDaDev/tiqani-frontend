# Internationalization and RTL

## Supported Locales

| Locale | Language         | Direction |
|--------|------------------|-----------|
| en     | English          | LTR       |
| ar     | Arabic           | RTL       |
| ku     | Sorani Kurdish   | RTL       |

## Technology

- `next-intl` for internationalization
- Locale-prefixed routes: `/en`, `/ar`, `/ku`
- Root `/` detects browser/saved locale and redirects

## Route Architecture

- `/[locale]/` — all pages are locale-prefixed
- `/[locale]/layout.tsx` sets `lang` and `dir` attributes
- Middleware handles locale detection and redirect

## Translation Files

Located in `messages/{locale}.json`.

Organized by namespaces:
- `common` — shared UI strings
- `navigation` — menu items
- `hero`, `trust`, `howItWorks`, `categories`, `whyTiqani` — sections
- `contractProtection`, `technicians`, `cta`, `footer` — more sections
- `errors` — error states
- `accessibility` — ARIA labels

## RTL Rules

1. Use logical CSS properties (`margin-inline-start` over `margin-left`)
2. Use Tailwind logical classes: `text-start`, `text-end`, `ms-*`, `me-*`
3. No hardcoded `left`/`right` positioning
4. Icons beside text reverse naturally in RTL
5. Mobile drawer opens from the logical start side
6. Process arrows and direction indicators use conditional reversal

## Language Persistence

- `next-intl` middleware sets a cookie
- User preference persists across sessions

## Future Route Preparation

- `/[locale]/login`
- `/[locale]/register`
- `/[locale]/marketplace`
- `/[locale]/chat`
- `/[locale]/contracts`
- `/[locale]/wallet`

These routes have placeholders only and are not implemented in Phase 0.
