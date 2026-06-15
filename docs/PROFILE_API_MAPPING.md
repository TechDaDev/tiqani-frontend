# Profile API Mappings

Frontend-to-backend proxy route mapping for all profile-related endpoints.

## Architecture

Browser → Next.js API Route Handler (same-origin) → Django Backend

All requests pass through Next.js route handlers which:
1. Attach the `Authorization: Bearer` header from HTTP-only cookies
2. Optionally check the user's role before proxying
3. Forward errors back to the browser unchanged

## Endpoint Map

### Account (all roles)

| Method | Frontend Route | Backend Route | Auth | Role Guard | Purpose |
|--------|---------------|---------------|------|------------|---------|
| GET | `/api/auth/me` | `/api/accounts/me/` | Bearer | — | Fetch current user profile |
| PATCH | `/api/auth/me` | `/api/accounts/me/` | Bearer | — | Update user fields |

**PATCH allowed fields:** `first_name`, `last_name`, `phone_number`, `governorate`, `address`, `gender`, `date_of_birth`, `profile_image`

### Clients

| Method | Frontend Route | Backend Route | Auth | Role Guard | Purpose |
|--------|---------------|---------------|------|------------|---------|
| GET | `/api/client/me` | `/api/clients/me/` | Bearer | `client` | Fetch client profile |
| PATCH | `/api/client/me` | `/api/clients/me/` | Bearer | `client` | Update client profile |

**PATCH allowed fields:** `phone_number`, `address`, `governorate`, `gender`, `date_of_birth`, `profile_image`

### Technicians

| Method | Frontend Route | Backend Route | Auth | Role Guard | Purpose |
|--------|---------------|---------------|------|------------|---------|
| GET | `/api/technicians/me` | `/api/technicians/me/` | Bearer | `technician` | Fetch technician profile |
| PATCH | `/api/technicians/me` | `/api/technicians/me/` | Bearer | `technician` | Update technician profile |
| GET | `/api/technicians/me/skills` | `/api/technicians/me/skills/` | Bearer | `technician` | Fetch skill set |
| PATCH | `/api/technicians/me/skills` | `/api/technicians/me/skills/` | Bearer | `technician` | Update skill set |
| GET | `/api/technicians/me/availability` | `/api/technicians/me/availability/` | Bearer | `technician` | Fetch availability |
| PATCH | `/api/technicians/me/availability` | `/api/technicians/me/availability/` | Bearer | `technician` | Toggle availability |
| GET | `/api/technicians/me/images` | `/api/technicians/me/images/` | Bearer | `technician` | List portfolio images |
| POST | `/api/technicians/me/images` | `/api/technicians/me/images/` | Bearer | `technician` | Upload portfolio image |
| GET | `/api/technicians/me/ratings` | `/api/technicians/me/ratings/` | Bearer | `technician` | Fetch rating stats |

**PATCH allowed fields (profile):** `job_title`, `about`, `years_of_expertise`, `github`, `linkedin`
**PATCH allowed fields (skills):** `categories` (UUID[]), `skills` (UUID[]), `sub_skills` (UUID[])
**PATCH allowed fields (availability):** `is_available` (boolean)

### Profile Completion (all roles)

| Method | Frontend Route | Backend Route | Auth | Role Guard | Purpose |
|--------|---------------|---------------|------|------------|---------|
| GET | `/api/profile/incomplete-fields` | `/api/auth/profile/incomplete-fields/` | Bearer | — | Get missing profile fields |

**Response:**
```json
{
  "is_complete": false,
  "incomplete_fields": ["phone_number", "governorate"],
  "total_required": 8,
  "completed_count": 6,
  "completion_percentage": 75
}
```

## Frontend Types (`lib/api/profiles.ts`)

### ClientProfileData
| Field | Type | Notes |
|-------|------|-------|
| `user_id` | `string` | UUID |
| `username` | `string` | |
| `full_name` | `string` | |
| `email` | `string\|null` | Masked for non-owners |
| `phone_number` | `string\|null` | Masked for non-owners |
| `governorate` | `string\|null` | |
| `address` | `string\|null` | |
| `gender` | `string\|null` | |
| `date_of_birth` | `string\|null` | Masked for non-owners |
| `profile_image` | `string\|null` | |
| `age` | `number\|null` | |
| `is_complete` | `boolean` | |
| `wallet_id` | `string\|null` | |
| `balance` | `string\|null` | |
| `created_at` | `string` | |

### TechnicianProfileData
| Field | Type | Notes |
|-------|------|-------|
| `user_id` | `string` | UUID |
| `username` | `string` | |
| `full_name` | `string` | |
| `email` | `string\|null` | Masked for non-owners |
| `phone_number` | `string\|null` | Masked for non-owners |
| `governorate` | `string\|null` | |
| `address` | `string\|null` | |
| `gender` | `string\|null` | |
| `date_of_birth` | `string\|null` | Masked for non-owners |
| `profile_image` | `string\|null` | |
| `job_title` | `string\|null` | |
| `about` | `string\|null` | |
| `years_of_expertise` | `number` | |
| `is_available` | `boolean` | |
| `approved` | `boolean\|null` | |
| `is_complete` | `boolean` | |
| `rate` | `string` | |
| `last_active` | `string\|null` | |
| `url1` | `string\|null` | GitHub URL (masked for non-owners) |
| `url2` | `string\|null` | LinkedIn URL (masked for non-owners) |
| `identification_documents` | `string\|null` | Masked for non-owners |
| `skill_sets` | `object` | Nested skill data |
| `images` | `array` | Portfolio images |
| `wallet_id` | `string\|null` | |
| `balance` | `string\|null` | |
| `created_at` | `string` | |

### IncompleteFieldsData
| Field | Type | Notes |
|-------|------|-------|
| `is_complete` | `boolean` | |
| `incomplete_fields` | `string[]` | Field names |
| `total_required` | `number` | |
| `completed_count` | `number` | |
| `completion_percentage` | `number` | 0-100 |

### TechnicianSkillsData
| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | |
| `categories` | `string[]` | UUIDs |
| `categories_detail` | `array` | `{id, name}` objects |
| `skills` | `string[]` | UUIDs |
| `skills_detail` | `array` | `{id, name}` objects |
| `sub_skills` | `string[]` | UUIDs |
| `sub_skills_detail` | `array` | `{id, name}` objects |
| `created_at` | `string` | |

### TechnicianAvailabilityData
| Field | Type |
|-------|------|
| `is_available` | `boolean` |
| `last_active` | `string\|null` |
| `is_online` | `boolean` |

### TechnicianImageData
| Field | Type |
|-------|------|
| `id` | `string` |
| `image` | `string` |
| `description` | `string` |
| `uploaded_at` | `string` |

### TechnicianRatingsData
| Field | Type |
|-------|------|
| `average_rating` | `number` |
| `total_reviews` | `number` |
| `rating_breakdown` | `object` |
| `recent_reviews` | `array` |

## Server-Side Role Guards

The `lib/api/role-guard.ts` utility provides `requireRole(request, allowedRoles[])` which:
1. Reads the access token from cookies
2. Fetches `/api/accounts/me/` to get the user's role
3. Returns 403 if the role is not in the allowed list
4. Returns the user data if allowed

This guard is applied to:
- `app/api/client/me/route.ts` — requires `client`
- `app/api/technicians/me/route.ts` — requires `technician`
- `app/api/technicians/me/skills/route.ts` — requires `technician`
- `app/api/technicians/me/availability/route.ts` — requires `technician`
- `app/api/technicians/me/images/route.ts` — requires `technician`
- `app/api/technicians/me/ratings/route.ts` — requires `technician`
