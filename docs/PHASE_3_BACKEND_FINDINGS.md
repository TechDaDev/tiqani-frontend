# Phase 3 Backend Findings

## Backend Branch

- Branch: `backend/phase-3-marketplace-filters`
- SHA: `7efafda`
- Remote: `https://github.com/TechDaDev/tiqani_v3`
- Changes: Added `search`, `category_id`, and `min_rating` query parameters to `TechnicianListView`

## Backend Capability Matrix

### Confirmed Support

| Feature | Endpoint | Parameters | Notes |
|---------|----------|------------|-------|
| Public list | `GET /api/technicians/` | `search`, `category_id`, `skill_id`, `governorate`, `is_available`, `min_rating`, `order_by`, `page`, `page_size` | All filters confirmed working |
| Public detail | `GET /api/technicians/<id>/` | Path param only | Returns 404 for unapproved/incomplete |
| Categories | `GET /api/categories/` | `page`, `page_size`, `q`, `parent_id`, `is_featured`, `is_active` | Full CRUD, staff-only write |
| Skills | `GET /api/categories/skills/` | `q`, `category_id`, `is_active` | |
| Sub-skills | `GET /api/categories/sub-skills/` | `q`, `skill_id`, `difficulty_level`, `is_active` | |
| Pagination | PageNumberPagination | `page`, `page_size` (default 20, max 100) | Standard DRF envelope |

### Visibility Rules (Confirmed)

- Public list: `is_complete=True AND approved=True` only
- Public detail: `approved=True` or owner/admin
- Unapproved profiles: 404 for non-owners
- `is_available` is NOT required for listing — it's an optional filter

### Backend Additions (Phase 3.1)

Three new filter parameters added to `TechnicianListView.get()`:

1. **`search`** (string) — `Q(full_name__icontains=search) | Q(job_title__icontains=search) | Q(about__icontains=search)`
2. **`category_id`** (UUID) — `skill_set__categories__id=category_id`
3. **`min_rating`** (float, 0-5) — `rate__gte=min_rating`

### Still Unsupported

| Feature | Reason | Impact |
|---------|--------|--------|
| Sub-skill filter | No model relation path | Low — filtering by skill is sufficient |
| Price/rate filters | No pricing model | Low — out of scope |
| Location proximity | No geo-coordinates | Low — out of scope |
| Free-text SearchFilter | Not using DRF SearchFilter | Resolved — manual icontains added |

## All 83 Backend Tests Pass

Running `python manage.py test accounts category --noinput`:
- 83 tests run
- 0 failures
- Duration: ~118s
