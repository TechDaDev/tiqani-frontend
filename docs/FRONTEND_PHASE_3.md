# Frontend Phase 3 — Marketplace and Technician Discovery

## Overview

Phase 3 adds the public marketplace for browsing and discovering technicians, along with public technician profile pages. Users can filter, sort, and paginate through approved technicians, then view detailed profiles.

## Scope

- **In scope:** Public technician listing with filters/sort/pagination, public technician detail pages, reference data endpoints (categories, skills), proxy route handlers, API client, localization (en/ar/ku), component tests, documentation
- **Out of scope (future phases):** Chat/messaging, price offers, contracts, wallet, project stages, review submission

## Files Created/Modified

### New Proxy Routes
| File | Purpose |
|------|---------|
| `app/api/marketplace/technicians/route.ts` | GET — public technician list |
| `app/api/marketplace/technicians/[publicId]/route.ts` | GET — public technician detail |
| `app/api/reference/categories/route.ts` | GET — categories list |
| `app/api/reference/skills/route.ts` | GET — skills list |
| `app/api/reference/sub-skills/route.ts` | GET — sub-skills list |

### New API Client
| File | Purpose |
|------|---------|
| `lib/api/marketplace.ts` | Types and functions for marketplace + reference endpoints |

### New Components
| File | Purpose |
|------|---------|
| `components/marketplace/TechnicianCard.tsx` | Card displaying a technician in the list |
| `components/marketplace/TechnicianFilters.tsx` | Filter controls (governorate, availability, sort) |
| `components/marketplace/MarketplaceSearch.tsx` | Search input (placeholder — no backend free-text search) |
| `components/marketplace/Pagination.tsx` | Page navigation with ellipsis |

### New Pages
| File | Purpose |
|------|---------|
| `app/[locale]/(public)/marketplace/page.tsx` | Main marketplace page with URL-driven query params |
| `app/[locale]/(public)/marketplace/technicians/[publicId]/page.tsx` | Public technician profile |

### Modified Files
| File | Change |
|------|--------|
| `messages/en.json` | Added `marketplace` and `publicProfile` sections |
| `messages/ar.json` | Added `marketplace` and `publicProfile` sections |
| `messages/ku.json` | Added `marketplace` and `publicProfile` sections |

## Architecture

### Routing
- Marketplace: `/marketplace` (no auth required)
- Public profile: `/marketplace/technicians/[publicId]` (no auth required)
- These reside in the `(public)` route group, using `PublicHeader`/`PublicFooter` directly

### State Management
- URL query params drive all state: `page`, `governorate`, `is_available`, `order_by`, `q`
- `useSearchParams()` for reading, `router.push()` for updating
- Filter changes reset page to 1

### Data Flow
```
Browser → browserRequest() → Next.js Route Handler → backendRequest() → Django API
```

### Query String Architecture
All filter/sort/pagination state lives in the URL. Benefits:
- Shareable/bookmarkable URLs
- Browser back/forward works
- No client-side state synchronization needed
- SSR-friendly (though this page is client-side rendered)

## Key Decisions

1. **URL-driven filters** — All state lives in query params rather than React state, making URLs shareable and browser navigation predictable.

2. **Client-side marketplace page** — Uses `"use client"` for the marketplace listing to keep interactivity simple and avoid SSR complexity with search params.

3. **Empty governorate list** — The `TechnicianFilters` component accepts a `governorates` prop pre-populated from the API, but currently passes an empty array since no standalone governorate endpoint exists.

4. **Search is a placeholder** — The backend has no free-text search. The search input renders with a hint informing users of this limitation, ready to connect when backend search is added.

5. **No mock data** — The UI faithfully shows loading, empty, and error states based on real API responses. No fake technician data is injected.

## Testing

See `__tests__/api/` and `__tests__/components/marketplace/` for test files covering:
- Proxy route handlers (mock backend responses)
- Component rendering (TechnicianCard, TechnicianFilters, Pagination)
- Marketplace page states (loading, empty, error, populated)

## Backend Dependencies

- `GET /api/technicians/` — Public listing with filters
- `GET /api/technicians/<id>/` — Public detail
- `GET /api/categories/` — Reference categories
- `GET /api/categories/skills/` — Reference skills
- `GET /api/categories/sub-skills/` — Reference sub-skills

All endpoints confirmed working and documented in `MARKETPLACE_API_MAPPING.md`.
