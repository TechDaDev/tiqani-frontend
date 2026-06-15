# Marketplace API Mappings

Frontend-to-backend proxy route mapping for marketplace, technician discovery, and reference data endpoints.

## Architecture

Browser → Next.js API Route Handler (same-origin) → Django Backend

Marketplace and reference endpoints are **public** — they do not require authentication.

## Endpoint Map

### Marketplace — Public Technician Listing

| Method | Frontend Route | Backend Route | Auth | Description |
|--------|---------------|---------------|------|-------------|
| GET | `/api/marketplace/technicians` | `/api/technicians/` | None | Paginated list of approved+complete technicians |

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `page_size` | integer | Items per page (default: 20, max: 100) |
| `governorate` | string | Filter by exact governorate name |
| `is_available` | boolean | Filter by availability (`true`/`false`) |
| `skill_id` | UUID | Filter by skill (exact match via TechnicianSkillSet) |
| `order_by` | string | Sort field (default: `-rate`). Any TechnicianProfile field. |

**Response:**
```json
{
  "count": 42,
  "next": "http://.../?page=3",
  "previous": "http://.../",
  "results": [
    {
      "user_id": "uuid",
      "username": "string",
      "full_name": "string",
      "governorate": "string|null",
      "profile_image": "url|null",
      "job_title": "string|null",
      "about": "string|null",
      "years_of_expertise": "int",
      "is_available": "bool",
      "rate": "decimal",
      "is_complete": "bool|null (admin only)",
      "incomplete_fields": ["string"]|null (admin only)"
    }
  ]
}
```

### Marketplace — Public Technician Detail

| Method | Frontend Route | Backend Route | Auth | Description |
|--------|---------------|---------------|------|-------------|
| GET | `/api/marketplace/technicians/[publicId]` | `/api/technicians/<id>/` | None | Public technician detail |

**Response** (same as `TechnicianProfileSerializer` with sensitive fields masked for non-owners):

```json
{
  "user_id": "uuid",
  "username": "string",
  "full_name": "string",
  "email": "string|null (owner/admin only)",
  "phone_number": "string|null (owner/admin only)",
  "governorate": "string|null",
  "gender": "string|null",
  "profile_image": "url|null",
  "job_title": "string|null",
  "about": "string|null",
  "years_of_expertise": "int",
  "is_available": "bool",
  "rate": "decimal",
  "is_complete": "bool",
  "last_active": "datetime|null",
  "url1": "string|null (owner/admin only)",
  "url2": "string|null (owner/admin only)",
  "skill_sets": {
    "detail": "...",
    "categories_detail": [{"id": "uuid", "name": "string"}],
    "skills_detail": [{"id": "uuid", "name": "string"}],
    "sub_skills_detail": [{"id": "uuid", "name": "string"}]
  },
  "images": [{"id": "uuid", "image": "url", "description": "string"}],
  "wallet_id": "string|null"
}
```

### Reference Data

| Method | Frontend Route | Backend Route | Auth | Description |
|--------|---------------|---------------|------|-------------|
| GET | `/api/reference/categories` | `/api/categories/` | None | List all categories (paginated) |
| GET | `/api/reference/skills` | `/api/categories/skills/` | None | List all skills |
| GET | `/api/reference/sub-skills` | `/api/categories/sub-skills/` | None | List all sub-skills |

## Visibility Rules

A technician appears in the public listing **if and only if**:
1. `TechnicianProfile.is_complete == True` (all required fields are filled)
2. `TechnicianProfile.approved == True` (admin approval)

The `is_available` field is **not** required for listing — it is an optional client-side filter. By default, all approved+complete technicians are returned.

## Pagination

- Type: `PageNumberPagination` (DRF standard)
- Default page size: 20
- Configurable via `page_size` query param (max: 100)
- Response envelope: `{ count, next, previous, results }`

## Frontend Types

All marketplace types are defined in `lib/api/marketplace.ts`:

- `PaginatedResponse<T>` — generic paginated response
- `TechnicianListItem` — list item shape
- `MarketplaceParams` — query param interface
- `CategoryData` / `CategoryDetailData` — category types
- `SkillData` / `SubSkillData` — skill types

## Known Limitations

1. **No free-text search** — The backend only supports exact-match filters. The search input in the UI is a placeholder for future implementation.
2. **No governorate endpoint** — Governorate values come from the backend database directly (filter using the `governorate` query param). A list of available governorates is not independently exposed.
3. **No rating filter** — Rating (`rate`) is shown but not filterable server-side; only sortable via `order_by=-rate`.
4. **No ordering whitelist** — Any `TechnicianProfile` field can be passed as `order_by`; no server-side validation is enforced.
