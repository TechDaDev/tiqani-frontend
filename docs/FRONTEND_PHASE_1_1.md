# FRONTEND_PHASE_1_1.md — Secure Cookie Sessions, Real Backend E2E, Auth Hardening

## Root Cause: Why Previous Forms Produced No Backend Traffic

**Diagnosis:** The Phase 1 authentication UI was structurally correct (forms had `onSubmit`, services called `apiPost`) but required the Django backend to be running on `http://127.0.0.1:8000` at the same time as the Next.js dev server. The most common cause of "no requests reaching the backend" was simply that Django was not started.

However, there were additional architectural problems:

1. **Direct browser-to-Django calls** — The browser made cross-origin requests to `http://127.0.0.1:8000`. While CORS was permissive in dev, this is not a production-safe topology.
2. **Refresh token in sessionStorage** — The refresh token was stored in `sessionStorage` where JavaScript could read it (XSS vulnerability).
3. **Access token in JS memory** — The access token was held in a module-level variable, manageable but could be leaked.
4. **No CSRF protection** — Direct browser calls had no CSRF handling.
5. **No centralized error handling** — Each route handler duplicated error parsing.

## Architecture: Browser → Next.js → Django

```
Browser                    Next.js (localhost:3000)           Django (127.0.0.1:8000)
   │                            │                                  │
   │  POST /api/auth/login      │                                  │
   │──────────────────────────► │  POST /api/auth/login/           │
   │                            │─────────────────────────────────►│
   │                            │  { access, refresh, userdata }   │
   │                            │◄─────────────────────────────────│
   │  Set-Cookie: tiqani_access (HttpOnly)                         │
   │  Set-Cookie: tiqani_refresh (HttpOnly)                        │
   │  { userdata }                                                 │
   │◄───────────────────────────│                                  │
   │                            │                                  │
   │  GET /api/auth/me          │                                  │
   │  Cookie: tiqani_access     │                                  │
   │──────────────────────────► │  GET /api/accounts/me/           │
   │                            │  Authorization: Bearer <access>  │
   │                            │─────────────────────────────────►│
   │                            │  { user profile }                │
   │                            │◄─────────────────────────────────│
   │  { user profile }          │                                  │
   │◄───────────────────────────│                                  │
```

### Key Design Decisions

1. **HTTP-only cookies** — The refresh and access tokens are stored as HTTP-only cookies. JavaScript in the browser cannot read them.
2. **Server-to-server communication** — Next.js API route handlers make internal requests to Django using the `BACKEND_INTERNAL_URL` env var. The browser never talks to Django directly.
3. **No token in JS memory** — The auth provider no longer stores `accessToken` or `refreshToken` in JavaScript variables or storage.
4. **Same-origin requests** — The browser calls `/api/auth/*` on the Next.js origin. No CORS needed.
5. **Blacklist on logout** — The Django backend blacklists the refresh token via `rest_framework_simplejwt.token_blacklist`.

## Cookie Names and Policy

| Cookie | Type | Max-Age | HttpOnly | Secure (prod) | SameSite |
|---|---|---|---|---|---|
| `tiqani_access` | JWT access token | 7200s (2h) | Yes | Yes | Lax |
| `tiqani_refresh` | JWT refresh token | 604800s (7d) | Yes | Yes | Lax |

## Refresh Lifecycle

1. Browser calls `GET /api/auth/me`
2. Next.js reads `tiqani_access` cookie
3. If access token is valid, Next.js calls Django with `Authorization: Bearer <access>`
4. Django returns user data → Next.js returns it to browser
5. If Django returns 401, Next.js calls `POST /api/auth/refresh` with `tiqani_refresh` cookie
6. Django returns new access token → Next.js updates `tiqani_access` cookie
7. Retries `/me` request once
8. If refresh also fails, Next.js clears both cookies and returns 401

## CSRF Design

Since the browser only makes same-origin requests to Next.js (not directly to Django), and the Next.js route handlers use Django JWT Bearer tokens (not session cookies) server-to-server, CSRF is handled by:
- Django CSRF is not required for JWT Bearer authentication
- Same-origin fetch with `credentials: "same-origin"` provides natural CSRF protection
- Django's `CSRF_TRUSTED_ORIGINS` is configured for `localhost:3000` and `127.0.0.1:3000` in dev

## CORS Design

CORS is minimized. The browser only communicates with the Next.js origin (`http://localhost:3000`). Django's `CORS_ALLOW_ALL_ORIGINS = True` in dev is only needed for potential direct API access (not used by the frontend).

## Network Proof

All requests confirmed in Django logs (`tiqani_v3/tiqani_v3/settings/dev.py`):

| Request | Method | Next.js Route | Django Endpoint | Status |
|---|---|---|---|---|
| Login | POST | `/api/auth/login` | `/api/auth/login/` | 200 |
| Current User | GET | `/api/auth/me` | `/api/accounts/me/` | 200 |
| Refresh | POST | `/api/auth/refresh` | `/api/auth/refresh/` | 200 |
| Logout | POST | `/api/auth/logout` | `/api/auth/logout/` | 205 |
| Register | POST | `/api/auth/register` | `/api/auth/register/` | 201 |
| Verify OTP | POST | `/api/auth/verify-otp` | `/api/auth/verify-email/` | 200 |
| Forgot Password | POST | `/api/auth/forgot-password` | `/api/auth/password-reset/` | 200/429 |

## Deleted/Deprecated Code

- `lib/api/client.ts` — Old direct-browser-to-Django client (kept for backwards compat, not used by new code)
- `sessionStorage` tokens — Removed from auth provider
- `localStorage` tokens — Never existed for auth
- `setAccessToken` — Removed from auth provider flow
