# Phase 2 Backend Findings

## Source

- **Backend branch:** `backend/phase-2-profile-integration`
- **Backend commit:** `51d8d0c`
- **Repository:** `tiqani_V3`

## Defects Found and Resolved

### 1. Completion-Method Defect

**Issue:** The backend exposed `get_incomplete_fields()` but the frontend expected it under a different name. The method was initially called `get_missing_fields()` in the serializer, causing a 500 error when the frontend called the endpoint.

**Resolution:** Renamed to `get_incomplete_fields()` (or aliased) in the backend serializer, matching the frontend's expected field name. Verified working after fix.

### 2. Skills Relation Defect

**Issue:** The technician skills endpoint returned 500 errors due to a relation resolution issue in the skills serializer. The nested `categories_detail`, `skills_detail`, and `sub_skills_detail` fields required proper source/target model wiring.

**Resolution:** Fixed the serializer relations to properly resolve UUID-based foreign keys to their display objects (`{id, name}`).

## Monitored Requests

The following requests were monitored live with the Django backend:

### Authentication

| Method | URL | Status | Notes |
|--------|-----|--------|-------|
| POST | `/api/auth/login/` | 200 | Login with username + password |
| POST | `/api/auth/register/` | 201 | Register client/technician |
| POST | `/api/auth/refresh/` | 200 | Token refresh |
| POST | `/api/auth/logout/` | 205 | Token blacklist |
| POST | `/api/auth/verify-email/` | 200 | OTP verification |
| POST | `/api/auth/resend-otp/` | 200 | Resend OTP |
| GET | `/api/accounts/me/` | 200 | Current user info |

### Client Profile

| Method | URL | Status | Notes |
|--------|-----|--------|-------|
| GET | `/api/clients/me/` | 200 | Client profile data |
| PATCH | `/api/clients/me/` | 200 | Update phone, governorate, address |

### Technician Profile

| Method | URL | Status | Notes |
|--------|-----|--------|-------|
| GET | `/api/technicians/me/` | 200 | Full technician profile |
| PATCH | `/api/technicians/me/` | 200 | Update job title, about, experience, URLs |
| GET | `/api/technicians/me/skills/` | 200 | Skills with category/skill/sub-skill details |
| PATCH | `/api/technicians/me/skills/` | 200 | Update skill sets (after fix) |
| GET | `/api/technicians/me/availability/` | 200 | Availability status |
| PATCH | `/api/technicians/me/availability/` | 200 | Toggle availability |
| GET | `/api/technicians/me/images/` | 200 | Portfolio images list |
| POST | `/api/technicians/me/images/` | 201 | Upload portfolio image (multipart) |
| GET | `/api/technicians/me/ratings/` | 200 | Rating stats and reviews |

### Profile Completion

| Method | URL | Status | Notes |
|--------|-----|--------|-------|
| GET | `/api/auth/profile/incomplete-fields/` | 200 | Completion tracking (after fix) |

## Status Codes Observed

| Code | Usage |
|------|-------|
| 200 | Successful GET/PATCH requests |
| 201 | Successful POST (image upload, register) |
| 205 | Successful logout (token blacklist) |
| 400 | Validation errors, missing fields |
| 401 | Missing/expired/invalid token |
| 403 | Wrong role for endpoint |
| 404 | Resource not found |
| 429 | Rate limited (password reset, resend OTP) |
| 500 | Backend serializer/relation error (before fixes) |

## Documentation Mismatches

### OpenAPI Schema Staleness

The backend's OpenAPI schema (served at `/api/schema/` via `drf-spectacular`) has several inaccuracies:

- Many endpoints show **"No response body"** despite returning rich JSON responses
- The `incomplete-fields` endpoint response schema is not reflected
- Technician skills and ratings response schemas are incomplete
- PATCH request body schemas are often listed as empty or partial

### Dual URL Paths

Some endpoints are accessible under two paths (with and without trailing slash). The frontend consistently uses paths without trailing slashes in Next.js proxy routes, but the Django backend requires trailing slashes:

| Frontend Route | Backend Route (with trailing slash) |
|---------------|--------------------------------------|
| `/api/client/me` | `/api/clients/me/` |
| `/api/technicians/me` | `/api/technicians/me/` |
| `/api/technicians/me/skills` | `/api/technicians/me/skills/` |
| `/api/technicians/me/availability` | `/api/technicians/me/availability/` |
| `/api/technicians/me/images` | `/api/technicians/me/images/` |
| `/api/technicians/me/ratings` | `/api/technicians/me/ratings/` |
| `/api/profile/incomplete-fields` | `/api/auth/profile/incomplete-fields/` |

Note the path difference: `/api/client/me` → `/api/clients/me/` (plural), and `/api/profile/incomplete-fields` → `/api/auth/profile/incomplete-fields/` (nested under auth).

## Remaining Backend Limitations

### 1. No Dedicated Onboarding Endpoint

There is no single endpoint that returns a structured onboarding state. The frontend must combine two calls:
- `GET /api/technicians/me/` — profile data
- `GET /api/auth/profile/incomplete-fields/` — completion status

### 2. No Reference-Data Endpoints

Categories, skills, and sub-skills must be sent as UUID arrays. There are no publicly accessible endpoints to list available categories/skills for dropdown selectors. This limits the frontend's ability to build a skill selector UI.

### 3. Onboarding Derives from Profile Completeness Only

The onboarding flow is entirely driven by `incomplete_fields[]`. There is no concept of "onboarding steps" on the backend — it's purely a profile completeness check. Any frontend enhancement (e.g., step-by-step wizard) must be built client-side.

### 4. Image Upload is Profile PATCH/Multipart Based

Portfolio images are uploaded via `POST /api/technicians/me/images/` as multipart/form-data. The profile image (avatar) is sent as part of a PATCH to `/api/clients/me/` or `/api/technicians/me/` with `profile_image` field. There is no separate avatar upload endpoint.

### 5. OpenAPI Schema is Incomplete

The drf-spectacular-generated OpenAPI schema has many "No response body" entries despite the endpoints returning comprehensive JSON payloads. If automated client generation is needed in the future, the backend serializer/view decorators need `@extend_schema` annotations to fill the gaps.

### 6. No Pagination on List Endpoints

Endpoints like images and ratings return full lists without pagination. This is acceptable now but may need pagination as data grows.

### 7. Rate Limiting on Auth Endpoints

Password reset and OTP resend endpoints are rate-limited (429 responses observed). The frontend handles these gracefully but the rate limit configuration is not exposed.
