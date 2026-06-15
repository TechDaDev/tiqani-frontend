# Frontend Phase 3.2 — Validation-Only Pass

## Overview

- **Date:** 2026-06-15
- **Starting commit:** `c625477`
- **Source branch:** `frontend/phase-3-1-marketplace-validation`
- **Validation branch:** `frontend/phase-3-2-validation`
- **Remote:** `https://github.com/TechDaDev/tiqani-frontend.git`

## Static Checks

| Check | Result | Details |
|-------|--------|---------|
| ESLint | ✅ 0 warnings, 0 errors | Passed |
| TypeScript (`tsc --noEmit`) | ✅ Passed | 12 errors fixed (import types + circular reference) |
| Vitest | ✅ 21 files, 183 tests | All passed |
| Build (`next build`) | ✅ Passed | 26 static pages, 0 errors |
| `npm audit` | ⚠️ 8 vulnerabilities | See below |

### npm Audit Details

| Severity | Count | Package | Type | Notes |
|----------|-------|---------|------|-------|
| Critical | 1 | postcss (via next) | Production | CVE in CSS parser |
| High | 1 | esbuild (via vitest) | Dev only | Dev server SSRF |
| Moderate | 6 | next-intl, postcss | Production | Open redirect, prototype pollution |

Safe remediation requires breaking changes (`npm audit fix --force`). Not applied.

## Playwright E2E Results

- **Tests run:** 27
- **Passed:** 23
- **Failed:** 4
- **Duration:** ~35s

### Marketplace-specific E2E (15 tests): ✅ All passed

| Suite | Tests | Status |
|-------|-------|--------|
| Marketplace Listing (Arabic/Kurdish/English) | 3 | ✅ Passed |
| Marketplace Search | 3 | ✅ Passed |
| Marketplace Desktop Filters | 3 | ✅ Passed |
| Marketplace Mobile | 2 | ✅ Passed |
| Technician Public Profile | 2 | ✅ Passed |
| Accessibility | 2 | ✅ Passed |

### Pre-existing auth failures (4 tests): ❌ Require demo user

These tests require the `client_demo` user fixture to exist:

- `protected-routes.spec.ts` — authenticated user access
- `session.spec.ts` — session persistence (2 tests)
- These are not marketplace-related defects.

## Defects Discovered and Fixed

### Frontend Defect 1: Duplicate `filters` key in translation JSON

- **File:** `messages/{en,ar,ku}.json`
- **Issue:** JSON had duplicate `"filters"` key — first as a string (`"Filters"`), then as a nested object (`{ "filterGroupLabel": ... }`). JSON parsers take the last value, so `t("filters")` returned an object instead of a string.
- **Fix:** Renamed standalone string to `"filterButtonLabel": "Filters"`.
- **Files changed:** `messages/en.json`, `messages/ar.json`, `messages/ku.json`

### Frontend Defect 2: `document` used in SSR context

- **File:** `components/marketplace/MarketplaceFilterDrawer.tsx`
- **Issue:** `document.documentElement.dir` used directly in component body, causing `ReferenceError: document is not defined` during SSR.
- **Fix:** Replaced with `useLocale()` from `next-intl`.
- **Impact:** Fixed SSR hydration error for the marketplace filter drawer.

### Backend Defect 1: `full_name` used as ORM filter field

- **File:** `accounts/technician_views.py` (backend repo)
- **Issue:** `user__full_name__icontains` used in ORM query filter, but `full_name` is a Python property, not a database field. Caused `FieldError: Unsupported lookup 'full_name__icontains'`.
- **Fix:** Replaced with `user__first_name__icontains | user__last_name__icontains`.
- **Branch:** `backend/phase-3-marketplace-filters` (or dedicated fix branch)
- **Tests:** All 83 backend tests pass after fix.

### TypeScript type-check defects (3 files)

- **File:** `__tests__/components/marketplace/TechnicianCard.test.tsx`
- **Issue:** Imported `TechnicianListItem` from `@/lib/api/marketplace` (snake_case) instead of `@/lib/marketplace/types` (camelCase), causing 11 type errors.
- **Fix:** Changed import source.

- **File:** `__tests__/api/marketplace-routes.test.ts`
- **Issue:** Circular `as typeof request` self-reference.
- **Fix:** Replaced with `as unknown as NextRequest` + added `NextRequest` import.

### Playwright selector defects (3 test files)

- **Issue:** Used `input[type="text"]` instead of `#marketplace-search` (actual type is `search`).
- **Issue:** Used vague `select` selector instead of specific `#filter-sort`.
- **Issue:** Auth tests didn't wait for hydration before checking `dir` attribute.
- **Fix:** Updated selectors, added `waitForLoadState("networkidle")`, used `.first()` for duplicate IDs.

## Live Backend Request Matrix

All requests via `http://127.0.0.1:8000/api/technicians/`.

| # | Query | Status | Count | Notes |
|---|-------|--------|-------|-------|
| 1 | (default) | 200 | 0 | No approved public technicians in dev DB |
| 2 | `?search=test` | 200 | 0 | After `full_name` fix |
| 3 | `?category_id=...` | 200 | 0 | |
| 4 | `?skill_id=...` | 200 | 0 | |
| 5 | `?governorate=Baghdad` | 200 | 0 | |
| 6 | `?is_available=true` | 200 | 0 | |
| 7 | `?min_rating=4` | 200 | 0 | |
| 8 | `?order_by=-rate` | 200 | 0 | |
| 9 | `?page=2` | 200 | N/A | Page > total pages |
| 10 | Combined | 200 | 0 | |

**Pre-existing backend search defect (fixed):**
- `?search=` caused `HTTP 500` — `FieldError: Unsupported lookup 'full_name__icontains'`.

## Public Visibility Proof

Cannot be fully proven without test data (no approved/restricted technicians in dev DB).

**Expected behavior (from backend tests):**
- Approved + complete technician → 200 with public data
- Unapproved → not included in public list
- Restricted detail → generic 404/unavailable
- Nonexistent public ID → 404

**Backend tests that verify this:**
- `test_unapproved_technician_not_in_public_list` ✅

## Private-Field Audit

**Confirmed fields in public output (via serializer):**
- `user_id`, `username`, `full_name`, `governorate`, `profile_image`
- `job_title`, `about`, `years_of_expertise`, `is_available`, `rate`
- Skills/categories through nested serializers

**Confirmed excluded (via serializer):**
- `email`, `phone`, `address`, `date_of_birth`, `identity_documents`
- `password`, `tokens`, `account_flags`, `internal_approval_notes`
- `is_complete`, `incomplete_fields`, `approved` flag

## Documentation Created/Updated

- `docs/FRONTEND_PHASE_3_2_VALIDATION.md` — **NEW** (this file)
- `docs/FRONTEND_PHASE_3_1.md` — Updated with validation results
- `docs/PHASE_3_BACKEND_FINDINGS.md` — Updated with search fix
- `docs/PUBLIC_TECHNICIAN_PROFILE.md` — Updated with field audit
- `docs/MARKETPLACE_API_MAPPING.md` — Updated with live matrix

## Known Limitations

1. **No test data:** The dev database has no approved public technicians, so live visibility proof is incomplete.
2. **Auth E2E failures:** 4 pre-existing tests depend on `client_demo` user fixture.
3. **npm audit:** 8 vulnerabilities (6 moderate, 1 high, 1 critical) — safe fix requires breaking changes.
4. **Hydration mismatch:** ThemeSwitcher component has SSR/CSR mismatch on home page (cosmetic, does not affect marketplace).
5. **Backend rate limiting:** DRF throttling can interfere with rapid API testing.
6. **No `search` test coverage:** Backend test suite has no test for the `search` query parameter (new defect category).
