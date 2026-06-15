# Role Architecture

## Overview

Tiqani uses a role-based access control (RBAC) system with seven roles defined on the Django backend. The frontend enforces role restrictions at three layers: proxy-level (API routes), server-side (page guards), and client-side (navigation shell).

## Client Roles

| Role | Type | Description |
|------|------|-------------|
| `client` | User | End customer browsing and requesting services |
| `technician` | User | Service provider with profile, skills, portfolio |
| `dealership` | Admin | Dealership partner account |
| `system_admin` | Admin | Full system access |
| `finance_admin` | Admin | Financial operations and reporting |
| `account_manager` | Admin | Customer/technician account management |
| `content_moderator` | Admin | Content and listing moderation |

## Role Utilities (`lib/auth/roles.ts`)

### Constants

```typescript
ALL_ROLES: UserRole[]
USER_ROLES: UserRole[]  // ["client", "technician"]
ADMIN_ROLES: UserRole[] // ["system_admin", "finance_admin", "account_manager", "content_moderator"]
```

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `normalizeRole` | `(role: string \| undefined \| null) => UserRole` | Normalizes a role string; returns `"client"` as default for null/undefined/invalid |
| `hasRole` | `(userRole, targetRole) => boolean` | Exact role match |
| `isClient` | `(role) => boolean` | `true` if role is `"client"` |
| `isTechnician` | `(role) => boolean` | `true` if role is `"technician"` |
| `isAdmin` | `(role) => boolean` | `true` if role is in `ADMIN_ROLES` |
| `getRoleHome` | `(role) => string` | Returns the default home path: `/profile/client`, `/profile/technician`, or `/account` |
| `getRoleLabelKey` | `(role) => string` | Returns i18n translation key for the role's display label |
| `canAccessRoute` | `(role, path) => boolean` | Checks if a role can access a given route path |

## Route Access Rules (`ROUTE_ACCESS`)

| Route Pattern | Allowed Roles |
|---------------|---------------|
| `/profile/client` | `client` |
| `/profile/technician` | `technician` |
| `/onboarding` | `technician` |
| `/account` | All roles |

`canAccessRoute()` checks exact match first, then suffix match against `ROUTE_ACCESS` entries, then defaults to allowing authenticated users.

## Server-Side Guards (`lib/auth/server-guards.ts`)

### `requireServerAuth(request)`

Validates the user's session by reading HTTP-only cookies and verifying with the Django backend.

**Returns:**
- `{ allowed: true, user, accessToken }` — authenticated
- `{ allowed: false, response }` — redirects to `/{locale}/login?next=...`

### `requireServerRole(request, allowedRoles[])`

Must be called after `requireServerAuth`. Verifies the authenticated user's role against the allowed list.

**Returns:**
- `{ allowed: true, user, accessToken }` — role matches
- `{ allowed: false, response }` — redirects to the user's role home page

## Proxy-Level Guards (`lib/api/role-guard.ts`)

### `requireRole(request, allowedRoles[])`

Used in API route handlers. Reads the access token from cookies, fetches `/api/accounts/me/` from Django to determine the user's role, and checks against the allowed list.

**Returns:**
- `{ allowed: true, user }` — role matches, includes `user` data
- `{ allowed: false, response }` — 401 (not authenticated) or 403 (wrong role)

**Applied to:**
- `app/api/client/me/route.ts` — requires `client`
- `app/api/technicians/me/route.ts` — requires `technician`
- `app/api/technicians/me/skills/route.ts` — requires `technician`
- `app/api/technicians/me/availability/route.ts` — requires `technician`
- `app/api/technicians/me/images/route.ts` — requires `technician`
- `app/api/technicians/me/ratings/route.ts` — requires `technician`

## Page Protection

| Scenario | Mechanism | Result |
|----------|-----------|--------|
| Anonymous user visits any protected page | `ProtectedRoute` in `(protected)/layout.tsx` | Redirect to `/{locale}/login?next=...` |
| Client visits technician profile page | `requireServerRole` (server-side) | Redirect to `/profile/client` |
| Technician visits client profile page | `requireServerRole` (server-side) | Redirect to `/profile/technician` |
| User with wrong role hits API proxy | `requireRole` in route handler | 403 with error detail |
| Unauthenticated user hits API proxy | `requireRole` cookie check | 401 with "Not authenticated" |

## Three-Layer Protection Model

```
Browser
  │
  ├── Client-Side: AuthShell filters nav items by user.role
  │     └─ Components/profile/auth-shell.tsx
  │
  ├── Server-Side: requireServerAuth + requireServerRole
  │     └─ lib/auth/server-guards.ts → redirects/forbids before page renders
  │
  └── Proxy-Level: requireRole in API route handlers
        └─ lib/api/role-guard.ts → 401/403 before request reaches Django
```

## Role Data Flow

```
1. User logs in → Django returns userdata with role
2. AuthProvider stores role in AuthUser context
3. Client-side: AuthShell reads user.role to filter navigation
4. Page load: middleware could run requireServerRole
5. API call: route handler runs requireRole before proxying to Django
```
