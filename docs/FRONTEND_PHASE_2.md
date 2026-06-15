# Frontend Phase 2 — Role-Aware Profiles, Onboarding & Shells

## Purpose

Phase 2 extends the authentication foundation with role-aware application shells, user profiles, technician onboarding, and server-side role guards. Users can view and edit their profile based on their role (client or technician), complete missing profile fields via an onboarding checklist, and navigate through a role-aware sidebar shell.

## Backend Commit

- **Backend branch:** `backend/phase-2-profile-integration`
- **Backend commit:** `51d8d0c`
- See [docs/PHASE_2_BACKEND_FINDINGS.md](PHASE_2_BACKEND_FINDINGS.md) for backend integration details and defects found.

## Files Created

### API Route Handlers (Next.js → Django proxies)

| File | Method(s) | Role Guard | Backend Target |
|------|-----------|------------|----------------|
| `app/api/client/me/route.ts` | GET, PATCH | `client` | `/api/clients/me/` |
| `app/api/technicians/me/route.ts` | GET, PATCH | `technician` | `/api/technicians/me/` |
| `app/api/technicians/me/skills/route.ts` | GET, PATCH | `technician` | `/api/technicians/me/skills/` |
| `app/api/technicians/me/availability/route.ts` | GET, PATCH | `technician` | `/api/technicians/me/availability/` |
| `app/api/technicians/me/images/route.ts` | GET, POST | `technician` | `/api/technicians/me/images/` |
| `app/api/technicians/me/ratings/route.ts` | GET | `technician` | `/api/technicians/me/ratings/` |
| `app/api/profile/incomplete-fields/route.ts` | GET | — | `/api/auth/profile/incomplete-fields/` |

### Role Architecture

| File | Purpose |
|------|---------|
| `lib/auth/roles.ts` | Role definitions, normalization, and route access rules |
| `lib/auth/types.ts` | `UserRole` union type and `AuthUser` interface (extended) |
| `lib/auth/server-session.ts` | Server-side token validation and user fetch |
| `lib/auth/server-guards.ts` | `requireServerAuth()` and `requireServerRole()` for page protection |
| `lib/api/role-guard.ts` | `requireRole()` for API route handler protection |

### Frontend API Client

| File | Purpose |
|------|---------|
| `lib/api/profiles.ts` | Types (`ClientProfileData`, `TechnicianProfileData`, `IncompleteFieldsData`, `TechnicianSkillsData`, etc.) + fetch/update functions |

### Pages

| Route | Description |
|-------|-------------|
| `app/[locale]/(protected)/account/page.tsx` | Account overview with profile image, contact info, role links |
| `app/[locale]/(protected)/profile/client/page.tsx` | Client profile editor (phone, governorate, address) |
| `app/[locale]/(protected)/profile/technician/page.tsx` | Technician profile editor (job title, about, experience, URLs) |
| `app/[locale]/(protected)/onboarding/page.tsx` | Technician onboarding checklist with progress bar, approval status |

### Components

| File | Purpose |
|------|---------|
| `components/profile/auth-shell.tsx` | Role-aware sidebar navigation shell wrapping all protected pages |

### Localization

- `messages/en.json` — New keys under `account.*`, `profile.*`, `onboarding.*`
- `messages/ar.json` — Arabic translations for all new keys
- `messages/ku.json` — Kurdish translations for all new keys

## Role Architecture

See [docs/ROLE_ARCHITECTURE.md](ROLE_ARCHITECTURE.md) for complete documentation.

### Layers of role protection

1. **Proxy-level guards** — `lib/api/role-guard.ts` checks user role before forwarding to backend
2. **Server-side page guards** — `lib/auth/server-guards.ts` redirects/forbids before page renders
3. **Client-side navigation** — `AuthShell` in `components/profile/auth-shell.tsx` shows/hides nav items based on role

### Roles supported

`client`, `technician`, `dealership`, `system_admin`, `finance_admin`, `account_manager`, `content_moderator`

## Auth Shell Component

`AuthShell` wraps all protected pages via `(protected)/layout.tsx`. It provides:

- A role-aware sidebar with navigation items filtered by `user.role`
- A mobile-responsive toggle menu
- A logout button
- Visual highlighting of the active page
- Integration with `PublicHeader` and `PublicFooter`

The layout chain is:

```
(protected)/layout.tsx
  └─ ProtectedRoute (redirects anonymous to login)
      └─ AuthShell (role-aware sidebar)
          └─ page content
```

## API Proxy Route Pattern

All profile API routes follow this pattern:

1. Read the `tiqani_access` HTTP-only cookie
2. Call `requireRole()` to verify the user's role against required roles
3. Proxy the request to Django's backend with `Authorization: Bearer <token>`
4. Return the backend response to the browser

Example (`app/api/client/me/route.ts`):

```typescript
export async function GET(request: NextRequest) {
  const guard = await requireRole(request, ["client"]);
  if (!guard.allowed) return guard.response;

  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS)?.value;
  const { data, status } = await backendGet("/api/clients/me/", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return NextResponse.json(data, { status });
}
```

## Test Coverage

- **Lint:** 1 warning (img tag vs next/image for dynamic user avatars)
- **Typecheck:** Clean
- **Tests:** 97/97 pass (existing test suite)
- **Build:** Succeeds

## Not Yet Built (Future Phases)

- Profile image upload UI (multipart upload endpoint exists, frontend not wired)
- Complete unit/E2E tests for new profile and onboarding pages
- Category/skill selector for technician skills (backend endpoint exists)
- Wallet balance display
- Admin approval workflow UI
- Admin dashboard pages
