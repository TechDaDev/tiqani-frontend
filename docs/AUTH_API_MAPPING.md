# Auth API Mapping

Based on backend inspection of TechDaDev/tiqani_v3.

## Base URLs

| Context | URL |
|---------|-----|
| Public browser API | `NEXT_PUBLIC_API_BASE_URL` (default `http://127.0.0.1:8000`) |
| Auth endpoints | `{base}/api/auth/` |
| Account endpoints | `{base}/api/accounts/` |

## Auth Method

- **Type**: JWT (access + refresh tokens)
- **Transport**: `Authorization: Bearer <access_token>` header
- **Refresh**: Send `refresh` token to `/api/auth/refresh/`
- **Logout**: Send `refresh` token to `/api/auth/logout/` (blacklisted)

## Endpoint Map

### Registration
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/api/auth/register/` |
| **Auth** | None |
| **Request** | `{ username, email, password, password_confirm?, first_name, last_name, role, phone_number?, governorate?, address?, gender?, date_of_birth?, profile_image?, job_title?, about?, years_of_expertise?, identification_documents?, github?, linkedin? }` |
| **Success** | `201` `{ detail, email }` |
| **Errors** | `400` validation (duplicate email/phone, password mismatch, missing job_title for technician) |

### Email Verification (OTP)
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/api/auth/verify-email/` |
| **Auth** | None |
| **Request** | `{ email, otp_code }` |
| **Success** | `200` `{ detail, username }` |
| **Errors** | `400` invalid/expired OTP |

### Resend OTP
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/api/auth/resend-otp/` |
| **Auth** | None |
| **Request** | `{ email }` |
| **Success** | `200` `{ detail, email, resends_remaining }` |
| **Errors** | `400` already verified, `429` cooldown/daily limit |

### Login
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/api/auth/login/` |
| **Auth** | None |
| **Request** | `{ username, password }` |
| **Success** | `200` `{ access, refresh, userdata: { id, username, role, full_name, profile_image, job_title?, is_available?, rating?, total_reviews? } }` |
| **Errors** | `401` invalid credentials (+ `attempts_remaining`), `403` inactive account, `429` rate limited |

### Token Refresh
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/api/auth/refresh/` |
| **Auth** | None |
| **Request** | `{ refresh }` |
| **Success** | `200` `{ access }` |

### Logout
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/api/auth/logout/` |
| **Auth** | None (but needs valid refresh token) |
| **Request** | `{ refresh }` |
| **Success** | `205` no body |

### Forgot Password
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/api/auth/password-reset/` |
| **Auth** | None |
| **Request** | `{ email }` |
| **Success** | `200` `{ detail, email }` (always generic — no account enumeration) |

### Password Reset Confirm
| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/api/auth/password-reset-confirm/` |
| **Auth** | None |
| **Request** | `{ email, otp_code, new_password }` |
| **Success** | `200` `{ detail, username }` |

### Current User
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/api/accounts/me/` |
| **Auth** | Bearer token |
| **Success** | `200` `{ id, username, role, first_name, last_name, email, phone_number, ... }` |

### Profile Completion
| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/api/auth/profile/incomplete-fields/` |
| **Auth** | Bearer token |
| **Success** | `200` `{ is_complete, incomplete_fields[], total_required, completed_count, completion_percentage }` |

## Token Storage Decision

**Strategy**: In-memory access token with HTTP-only cookie refresh token via Next.js route handlers (auth proxy).

**Reasoning**:
- Refresh tokens never exposed to JavaScript
- Access tokens short-lived (memory only)
- Backend uses JWT with blacklisting for logout

## User Roles (from backend)

```
client | technician | dealership | system_admin | finance_admin | account_manager | content_moderator
```
