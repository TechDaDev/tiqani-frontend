# Frontend Phase 1 — Authentication

## Status

Phase 1 implements authentication, session management, and protected routes.

## Auth Endpoints

See `docs/AUTH_API_MAPPING.md` for complete endpoint documentation.

## Pages Implemented

| Route | Description |
|-------|-------------|
| `/[locale]/login` | Login with username/password |
| `/[locale]/register` | Register as client or technician |
| `/[locale]/verify-otp` | Email verification via OTP |
| `/[locale]/forgot-password` | Request password reset |
| `/[locale]/reset-password` | Confirm reset with OTP + new password |
| `/[locale]/account` | Protected account status page |

## Auth Flow

1. Register → OTP verification → Login → Account page
2. Forgot password → Reset via OTP → Login

## Architecture

- API client in `lib/api/` with error normalization
- Auth service in `lib/auth/service.ts`
- Auth provider in `components/auth/auth-provider.tsx`
- Route guards: `ProtectedRoute`, `GuestRoute`
- Forms: `LoginForm`, `RegisterForm`, `OtpForm`, `ForgotPasswordForm`, `ResetPasswordForm`
