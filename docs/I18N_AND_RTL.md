# Internationalization and RTL

## Supported Locales

| Locale | Language         | Direction | Default |
|--------|------------------|-----------|---------|
| ar     | Arabic           | RTL       | **yes** |
| en     | English          | LTR       |         |
| ku     | Sorani Kurdish   | RTL       |         |

## Locale Selection Priority

1. Saved locale cookie (`NEXT_LOCALE`)
2. Arabic fallback (default)

The root `/` does **not** inspect the browser's Accept-Language header. This ensures Arabic is always the first-visit default.

## Technology

- `next-intl` for internationalization
- Locale-prefixed routes: `/en`, `/ar`, `/ku`
- Root `/` reads the locale cookie and redirects

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

## Mobile Navigation (Drawer)

The mobile side navigation uses `NEXT_LOCALE` cookie
- User preference persists across sessions
- Clearing the cookie returns the user to Arabic

### Cookie Behavior Examples

| Condition | Result |
|-----------|--------|
| First visit, no cookie | `/` → `/ar` |
| Cookie set to `en` | `/` → `/en` |
| Cookie set to `ku` | `/` → `/ku` |
| Cookie set to invalid value | `/` → `/ar` |
| Cookie cleared | `/` → `/ar` |
- **LTR (English)**: `left-0`, closed with `-translate-x-full`
- **RTL (Arabic, Kurdish)**: `right-0`, closed with `translate-x-full`

The drawer:
- Starts closed in all locales (initial state is always `false`)
- Closes on route change and locale switch
- Hides on desktop (`.md:hidden`)
- Closes on viewport resize to ≥768px
- Locks body scroll while open
- Returns focus to the trigger on close

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
