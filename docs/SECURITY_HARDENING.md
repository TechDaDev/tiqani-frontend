# Frontend Security Hardening

- HTTP-only cookies store access and refresh JWTs.
- Same-origin route handlers proxy backend requests.
- Admin route group blocks non-admin users.
- Admin writes require confirmation reason.
- CSP blocks framing with `frame-ancestors 'none'`.
- `X-Content-Type-Options=nosniff`.
- `Referrer-Policy=strict-origin-when-cross-origin`.
- `Permissions-Policy` disables camera, microphone, geolocation, and payment.
- HSTS is enabled only when `NODE_ENV=production`.
