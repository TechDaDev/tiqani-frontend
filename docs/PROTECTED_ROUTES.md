# Protected Routes

## Overview

Tiqani protects routes at three layers: client-side (React components), server-side (Next.js server components/route handlers), and proxy-level (API route guards). This multi-layered approach ensures protection even if one layer fails.

## Auth Flow Diagram

```
                              ┌─────────────────────────────┐
                              │      Browser Request         │
                              │  (page navigation or API)   │
                              └─────────────┬───────────────┘
                                            │
                                            ▼
                            ┌───────────────────────────────┐
                            │     ProtectedRoute (client)    │
                            │  checks isAuthenticated from   │
                            │  AuthProvider context          │
                            └──────┬────────────┬───────────┘
                                   │            │
                          ┌────────┘            └────────┐
                          ▼                             ▼
              ┌──────────────────┐          ┌──────────────────────┐
              │ Authenticated    │          │ Unauthenticated      │
              │ → render content │          │ → redirect to login  │
              └────────┬─────────┘          └──────────────────────┘
                       │
                       ▼
              ┌─────────────────────────────────────────┐
              │     AuthShell (client-side navigation)   │
              │  filters sidebar nav items by user.role  │
              └────────────────┬────────────────────────┘
                               │
                               ▼
              ┌─────────────────────────────────────────┐
              │     API Route Handler (Next.js proxy)   │
              │                                        │
              │  1. Read tiqani_access cookie           │
              │  2. Call requireRole()                  │
              │  3. Proxy to Django if allowed          │
              └────────────────┬────────────────────────┘
                               │
                               ▼
              ┌─────────────────────────────────────────┐
              │     Django Backend                       │
              │  validates JWT token, returns data       │
              └─────────────────────────────────────────┘
```

## Cookie-Based Auth Architecture

```
Browser              Next.js (port 3000)         Django (port 8000)
   │                       │                          │
   │  POST /api/auth/login │                          │
   │──────────────────────►│  POST /api/auth/login/   │
   │                       │─────────────────────────►│
   │                       │  { access, refresh, ... }│
   │                       │◄─────────────────────────│
   │  Set-Cookie:          │                          │
   │  tiqani_access        │                          │
   │  (HttpOnly, SameSite) │                          │
   │◄──────────────────────│                          │
   │                       │                          │
   │  GET /profile/client  │                          │
   │  Cookie: tiqani_access│                          │
   │──────────────────────►│                          │
   │                       │  GET /api/accounts/me/   │
   │                       │  Auth: Bearer <access>   │
   │                       │─────────────────────────►│
   │                       │  { id, role, ... }       │
   │                       │◄─────────────────────────│
   │                       │                          │
   │  Role = client ✓      │                          │
   │  Render client page   │                          │
   │◄──────────────────────│                          │
```

### Key Design Decisions

- **HTTP-only cookies** — Tokens are never accessible to JavaScript in the browser
- **Same-origin requests** — Browser calls `/api/*` on the Next.js origin; no CORS needed
- **Server-to-server** — Next.js proxies requests to Django using the access token
- **No JS-visible tokens** — AuthProvider does not store `accessToken` or `refreshToken`

## Client-Side Protection

### ProtectedRoute

**File:** `components/auth/protected-route.tsx`

Wraps all pages in `(protected)/layout.tsx`. Uses `useAuth()` to check authentication status.

```typescript
// Behavior:
// - isLoading → show spinner fallback
// - !isAuthenticated → redirect to /{locale}/login?next=/{locale}/account
// - isAuthenticated → render children
```

### AuthShell

**File:** `components/profile/auth-shell.tsx`

Provides role-aware navigation. Filters sidebar items based on `user.role`:

- **Client users** see: Account, Client Profile
- **Technician users** see: Account, Technician Profile, Onboarding
- **Admin users** see: Account (only — admin pages not yet built)

### GuestRoute

**File:** `components/auth/guest-route.tsx`

Inverse of ProtectedRoute — redirects authenticated users away from login/register pages.

## Server-Side Protection

### requireServerAuth (`lib/auth/server-guards.ts`)

Used in server components and layouts. Reads HTTP-only cookies, validates with Django backend.

```
Input: NextRequest (with cookies)
  ├── Read tiqani_access + tiqani_refresh cookies
  ├── Call getServerUser() → validates via Django /api/accounts/me/
  ├── If valid → return { allowed: true, user, accessToken }
  └── If invalid → return { allowed: false, response } (redirect to login)
```

### requireServerRole (`lib/auth/server-guards.ts`)

Must be called after `requireServerAuth`. Checks user role against allowed roles.

```
Input: NextRequest, allowedRoles[]
  ├── Run requireServerAuth first
  ├── If role matches → return { allowed: true }
  └── If role mismatch → redirect to user's role home page
```

## Proxy-Level Protection

### requireRole (`lib/api/role-guard.ts`)

Used in API route handlers before proxying to Django.

```
Input: NextRequest, allowedRoles[]
  ├── Read tiqani_access cookie
  ├── Fetch /api/accounts/me/ from Django with Bearer token
  ├── If no token → 401 "Not authenticated"
  ├── If wrong role → 403 "This endpoint requires role: ..."
  └── If role matches → return user data
```

## Route Protection Matrix

| Route | Client Guard | Server Guard | Role Required |
|-------|-------------|--------------|---------------|
| `/[locale]/login` | GuestRoute | — | — |
| `/[locale]/register` | GuestRoute | — | — |
| `/[locale]/account` | ProtectedRoute | — | Any authenticated |
| `/[locale]/profile/client` | ProtectedRoute | requireServerRole | `client` |
| `/[locale]/profile/technician` | ProtectedRoute | requireServerRole | `technician` |
| `/[locale]/onboarding` | ProtectedRoute | requireServerRole | `technician` |
| All other `/(protected)/*` | ProtectedRoute | — | Any authenticated |

## API Route Protection

| API Route | Role Guard | Required Role |
|-----------|-----------|---------------|
| `/api/client/me` | requireRole | `client` |
| `/api/technicians/me` | requireRole | `technician` |
| `/api/technicians/me/skills` | requireRole | `technician` |
| `/api/technicians/me/availability` | requireRole | `technician` |
| `/api/technicians/me/images` | requireRole | `technician` |
| `/api/technicians/me/ratings` | requireRole | `technician` |
| `/api/auth/*` | — | — |
| `/api/profile/incomplete-fields` | — | Any authenticated |
