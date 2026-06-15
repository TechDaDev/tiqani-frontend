# Marketplace Query Model

## Query Parameters

All filter, search, sort, and pagination state is stored in URL query parameters. This makes URLs shareable, bookmarkable, and preserves state across navigation.

### Confirmed Backend Parameters

| Parameter | Type | Backend Field | Description |
|-----------|------|---------------|-------------|
| `search` | string | `full_name`, `job_title`, `about` (icontains) | Keyword search added in Phase 3.1 |
| `category_id` | UUID | `skill_set__categories__id` | Filter by category added in Phase 3.1 |
| `skill_id` | UUID | `skill_set__skills__id` | Filter by skill |
| `governorate` | string | `user__governorate` | Exact match |
| `is_available` | boolean | `is_available` | `true` or `false` |
| `min_rating` | float (0-5) | `rate__gte` | Minimum rating filter added in Phase 3.1 |
| `order_by` | string | Any `TechnicianProfile` field | Sort field (default `-rate`) |
| `page` | integer | Page number | Default: 1 |
| `page_size` | integer | Items per page | Default: 20, Max: 100 |

### Supported Ordering Values

| Value | Meaning |
|-------|---------|
| `-rate` (default) | Highest rated |
| `rate` | Lowest rated |
| `-years_of_expertise` | Most experienced |
| `years_of_expertise` | Least experienced |
| `full_name` | Name A–Z |
| `-full_name` | Name Z–A |

### Unsupported (Documented Gaps)

| Feature | Reason |
|---------|--------|
| Free-text search on backend | Not a gap — `search` param was added in Phase 3.1 backend branch |
| Sub-skill filter | Backend has no `sub_skill_id` filter on technician list |
| Rating `gte` filter | Not a gap — `min_rating` was added in Phase 3.1 backend branch |
| Price filter | No pricing model on technicians |
| Location proximity | No geo-coordinates on profiles |

## Query Model (`lib/marketplace/query.ts`)

### Functions

| Function | Description |
|----------|-------------|
| `parseMarketplaceQuery(searchParams)` | Parse `URLSearchParams` into typed query object |
| `serializeMarketplaceQuery(query)` | Convert query object back to `URLSearchParams` |
| `normalizeMarketplaceQuery(query)` | Clean/normalize all values, clamp ranges |
| `updateMarketplaceQuery(current, changes)` | Merge changes, resetting page to 1 when filters change |
| `clearMarketplaceFilters(query)` | Remove all filters, keep minimal state |
| `getActiveFilterCount(query)` | Count active filter parameters |
| `queryToFilterValues(query)` | Convert to `FilterValues` for UI components |
| `filterValuesToQuery(values)` | Convert UI values back to query partial |

### Behavior

- **Page reset**: Changing any search/filter/sort parameter resets `page` to 1
- **Invalid values**: Unsupported `order_by`, out-of-range `min_rating`, or invalid `page` values are silently replaced with defaults
- **Empty strings**: Normalized to `undefined` (omitted from URL)
- **Unknown parameters**: Safely ignored during parsing
