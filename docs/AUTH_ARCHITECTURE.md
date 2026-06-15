# Auth Architecture

## Token Strategy

- **Access token**: Stored in memory (JavaScript variable). Never persisted to localStorage.
- **Refresh token**: Stored in `sessionStorage` (survives page refresh, cleared on tab close).
- **No localStorage for tokens**.
- **No tokens in URLs or logs**.

## Session Lifecycle

1. **Login**: POST credentials → receive `{access, refresh, userdata}` → store refresh in sessionStorage, access in memory.
2. **Subsequent requests**: Access token attached as `Authorization: Bearer <access>` header.
3. **Expiry**: If a 401 response is received, a single-flight refresh is attempted.
4. **Refresh failure**: Session cleared, user redirected to login.

## Auth Provider

`AuthProvider` wraps the app in `[locale]/layout.tsx`. Exposes:
- `user`, `status`, `isAuthenticated`, `isLoading`
- `login()`, `register()`, `logout()`, `refreshSession()`
- `verifyOtp()`, `resendOtp()`, `forgotPassword()`, `resetPassword()`

## Route Guards

- `ProtectedRoute` — redirects unauthenticated to login with `?next=` parameter.
- `GuestRoute` — redirects authenticated users to account page.

## Backend

- JWT-based with access + refresh tokens.
- Endpoints at `/api/auth/` (register, login, refresh, logout, verify-email, resend-otp, password-reset, password-reset-confirm).
- Current user at `/api/accounts/me/` (requires Bearer token).
