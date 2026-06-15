# Session Security — tiqani-frontend

## Cookie Storage

Authentication tokens are stored exclusively in HTTP-only cookies:

- **`tiqani_access`** — JWT access token (2 hour lifetime)
- **`tiqani_refresh`** — JWT refresh token (7 day lifetime)

### Cookie Attributes (Development)

| Attribute | `tiqani_access` | `tiqani_refresh` |
|---|---|---|
| `HttpOnly` | ✅ | ✅ |
| `Secure` | ❌ (dev) / ✅ (prod) | ❌ (dev) / ✅ (prod) |
| `SameSite` | `Lax` | `Lax` |
| `Path` | `/` | `/` |
| `Max-Age` | 7200s (2h) | 604800s (7d) |

### Security Properties

- **JavaScript cannot read token values** — Both cookies are `HttpOnly`
- **Tokens are not in sessionStorage** — Removed in Phase 1.1
- **Tokens are not in localStorage** — Never used
- **Tokens are not returned in response bodies** — Login returns only `userdata`, not the tokens
- **No token logging** — Route handlers do not log `Authorization`, `Cookie`, or response token values

## Refresh Flow

1. When `/api/auth/me` returns 401 (expired access token), the browser calls `/api/auth/refresh`
2. Next.js reads the `tiqani_refresh` cookie from the request
3. Next.js forwards the refresh token to Django `POST /api/auth/refresh/`
4. Django returns a new access token
5. Next.js updates the `tiqani_access` cookie
6. The original `/api/auth/me` request is retried once
7. If refresh fails, both cookies are cleared and the user is unauthenticated

## Logout

1. Browser calls `POST /api/auth/logout`
2. Next.js reads `tiqani_refresh` cookie and calls Django `POST /api/auth/logout/` to blacklist the token
3. Django returns 205
4. Next.js clears both cookies (sets `Max-Age: 0`)
5. User is unauthenticated

## Protected Routes

- Server-side validation checks for valid `tiqani_access` cookie
- Client-side `AuthProvider` redirects unauthenticated users
- Both layers apply — defense in depth
- Safe redirect validation prevents open redirect attacks

## Production Considerations

Before production deployment:
1. Set `Secure: true` on both cookies
2. Review `SameSite` attribute based on deployment topology
3. Ensure HTTPS is enforced
4. Set appropriate `BACKEND_INTERNAL_URL` for the Django backend
5. Consider adding `__Host-` prefix to cookie names for additional security
