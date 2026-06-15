# Public Technician Profile

## Canonical Route

```
/[locale]/marketplace/technicians/[publicId]
```

## Visible Fields (Public)

The following fields are returned by the public list and detail endpoints for approved technicians.

### List Endpoint (`GET /api/technicians/`)

| Field | Type | Classification | Notes |
|-------|------|---------------|-------|
| `user_id` | UUID | ✅ Safe public | Public UUID, not internal DB ID |
| `username` | string | ✅ Safe public | |
| `full_name` | string | ✅ Safe public | |
| `governorate` | string\|null | ✅ Safe public | |
| `profile_image` | URL\|null | ✅ Safe public | Validated via mapper |
| `job_title` | string\|null | ✅ Safe public | |
| `about` | string\|null | ✅ Safe public | |
| `years_of_expertise` | int | ✅ Safe public | |
| `is_available` | bool | ✅ Safe public | |
| `rate` | decimal | ✅ Safe public | Average rating |

### Detail Endpoint (`GET /api/technicians/<id>/`)

Additional fields only accessible by the profile owner or admin:

| Field | Type | Classification | Notes |
|-------|------|---------------|-------|
| `email` | string\|null | 🔒 Owner/Admin only | Masked for public |
| `phone_number` | string\|null | 🔒 Owner/Admin only | |
| `address` | string\|null | 🔒 Owner/Admin only | |
| `date_of_birth` | date\|null | 🔒 Owner/Admin only | |
| `url1` (github) | URL\|null | 🔒 Owner/Admin only | |
| `url2` (linkedin) | URL\|null | 🔒 Owner/Admin only | |
| `identification_documents` | File\|null | 🔒 Owner/Admin only | Never exposed |
| `balance` | decimal\|null | 🔒 Owner/Admin only | Wallet balance |
| `approved` | bool\|null | 🔒 Owner/Admin only | Approval status |

### Private Fields (Never Exposed)

- Internal database ID (PK) — the `user_id` is a UUID, not sequential
- Internal approval notes
- Password hash
- `is_delete`, `created_at`, `updated_at` (timestamp fields)
- JWT tokens, refresh tokens
- Authentication metadata

## Visibility Rules

| Technician State | Public List | Public Detail |
|-----------------|-------------|---------------|
| Approved + complete | ✅ Shown | ✅ Shown |
| Unapproved | ❌ Hidden | 404 |
| Incomplete | ❌ Hidden | 404 |
| Unapproved + incomplete | ❌ Hidden | 404 |
| Nonexistent | — | 404 |
| Suspended/deleted | ❌ Hidden | 404 |

**Rule:** A technician appears in the public listing **iff** `is_complete=True AND approved=True`.
The backend is authoritative — the frontend never performs filtering of already-fetched results.

## SEO

- Canonical URL: `https://tiqani.com/{locale}/marketplace/technicians/{publicId}`
- Language alternates: en/ar/ku
- Title: `{full_name} - Technician Profile | Tiqani`
- Description derived from `job_title` and `about`
- Open Graph: Profile image, name, title
- `noindex` applied to unavailable/not-found profiles
- All external links use `target="_blank" rel="noopener noreferrer"`
