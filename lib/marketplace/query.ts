/**
 * Marketplace query model — type-safe query parameter handling.
 *
 * Confirmed backend query parameters:
 * - search: icontains on full_name, job_title, about (added in Phase 3.1)
 * - category_id: filter by skill_set__categories__id (added in Phase 3.1)
 * - skill_id: filter by skill_set__skills__id
 * - governorate: exact match on user__governorate
 * - is_available: boolean filter
 * - min_rating: rate__gte filter (0-5, added in Phase 3.1)
 * - order_by: sort field (default -rate)
 * - page: page number (default 1)
 * - page_size: items per page (default 20, max 100)
 */

// ── Supported ordering values (backend column names) ──────────

const SUPPORTED_ORDERING = new Set([
  "-rate",
  "rate",
  "-years_of_expertise",
  "years_of_expertise",
  "full_name",
  "-full_name",
]);

const DEFAULT_ORDERING = "-rate";
const MIN_RATING_MIN = 0;
const MIN_RATING_MAX = 5;
const PAGE_MIN = 1;

// ── Types ─────────────────────────────────────────────────────

export interface MarketplaceQuery {
  search?: string;
  category_id?: string;
  skill_id?: string;
  governorate?: string;
  is_available?: string; // "" | "true" | "false"
  min_rating?: number;
  order_by?: string;
  page?: number;
  page_size?: number;
}

export interface FilterValues {
  governorate: string;
  is_available: string;
  skill_id: string;
  category_id: string;
  min_rating: string;
  order_by: string;
}

// ── Parse from URLSearchParams ────────────────────────────────

export function parseMarketplaceQuery(
  searchParams: URLSearchParams
): MarketplaceQuery {
  const query: MarketplaceQuery = {};

  const search = searchParams.get("search");
  if (search) query.search = search;

  const category_id = searchParams.get("category_id");
  if (category_id) query.category_id = category_id;

  const skill_id = searchParams.get("skill_id");
  if (skill_id) query.skill_id = skill_id;

  const governorate = searchParams.get("governorate");
  if (governorate) query.governorate = governorate;

  const is_available = searchParams.get("is_available");
  if (is_available) query.is_available = is_available;

  const minRating = searchParams.get("min_rating");
  if (minRating) {
    const parsed = Number(minRating);
    if (!isNaN(parsed) && parsed >= MIN_RATING_MIN && parsed <= MIN_RATING_MAX) {
      query.min_rating = parsed;
    }
  }

  const order_by = searchParams.get("order_by");
  if (order_by && SUPPORTED_ORDERING.has(order_by)) {
    query.order_by = order_by;
  }

  const page = searchParams.get("page");
  if (page) {
    const parsed = Number(page);
    if (!isNaN(parsed) && parsed >= PAGE_MIN) {
      query.page = parsed;
    }
  }

  const page_size = searchParams.get("page_size");
  if (page_size) {
    const parsed = Number(page_size);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 100) {
      query.page_size = parsed;
    }
  }

  return query;
}

// ── Serialize to URLSearchParams ──────────────────────────────

export function serializeMarketplaceQuery(
  query: MarketplaceQuery
): URLSearchParams {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.category_id) params.set("category_id", query.category_id);
  if (query.skill_id) params.set("skill_id", query.skill_id);
  if (query.governorate) params.set("governorate", query.governorate);
  if (query.is_available) params.set("is_available", query.is_available);
  if (query.min_rating !== undefined) params.set("min_rating", String(query.min_rating));
  if (query.order_by) params.set("order_by", query.order_by);
  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.page_size && query.page_size !== 20) params.set("page_size", String(query.page_size));

  return params;
}

// ── Normalize ─────────────────────────────────────────────────

export function normalizeMarketplaceQuery(
  query: MarketplaceQuery
): MarketplaceQuery {
  const normalized: MarketplaceQuery = {};

  if (query.search?.trim()) normalized.search = query.search.trim();
  if (query.category_id) normalized.category_id = query.category_id;
  if (query.skill_id) normalized.skill_id = query.skill_id;
  if (query.governorate) normalized.governorate = query.governorate;

  if (query.is_available === "true" || query.is_available === "false") {
    normalized.is_available = query.is_available;
  }

  if (
    query.min_rating !== undefined &&
    query.min_rating >= MIN_RATING_MIN &&
    query.min_rating <= MIN_RATING_MAX
  ) {
    normalized.min_rating = query.min_rating;
  }

  normalized.order_by =
    query.order_by && SUPPORTED_ORDERING.has(query.order_by)
      ? query.order_by
      : DEFAULT_ORDERING;

  normalized.page =
    query.page !== undefined && query.page >= PAGE_MIN ? query.page : 1;

  if (query.page_size && query.page_size >= 1 && query.page_size <= 100) {
    normalized.page_size = query.page_size;
  }

  return normalized;
}

// ── Update query (resets page when filters change) ────────────

export function updateMarketplaceQuery(
  current: MarketplaceQuery,
  changes: Partial<MarketplaceQuery>
): MarketplaceQuery {
  const hasFilterChange =
    "search" in changes ||
    "category_id" in changes ||
    "skill_id" in changes ||
    "governorate" in changes ||
    "is_available" in changes ||
    "min_rating" in changes ||
    "order_by" in changes;

  const merged = { ...current, ...changes };

  // Reset page to 1 when filters change (unless page itself is being set)
  if (hasFilterChange && !("page" in changes)) {
    merged.page = 1;
  }

  return normalizeMarketplaceQuery(merged);
}

// ── Clear all filter-related fields (preserves locale, page) ──

export function clearMarketplaceFilters(
  query: MarketplaceQuery
): MarketplaceQuery {
  return normalizeMarketplaceQuery({
    page: 1,
  });
}

// ── Get active filter count ───────────────────────────────────

export function getActiveFilterCount(query: MarketplaceQuery): number {
  let count = 0;
  if (query.search) count++;
  if (query.category_id) count++;
  if (query.skill_id) count++;
  if (query.governorate) count++;
  if (query.is_available) count++;
  if (query.min_rating !== undefined) count++;
  return count;
}

// ── Convert URLSearchParams to FilterValues for UI components ──

export function queryToFilterValues(query: MarketplaceQuery): FilterValues {
  return {
    governorate: query.governorate || "",
    is_available: query.is_available || "",
    skill_id: query.skill_id || "",
    category_id: query.category_id || "",
    min_rating: query.min_rating !== undefined ? String(query.min_rating) : "",
    order_by: query.order_by || DEFAULT_ORDERING,
  };
}

export function filterValuesToQuery(values: FilterValues): Partial<MarketplaceQuery> {
  return {
    governorate: values.governorate || undefined,
    is_available: values.is_available || undefined,
    skill_id: values.skill_id || undefined,
    category_id: values.category_id || undefined,
    min_rating: values.min_rating ? Number(values.min_rating) : undefined,
    order_by: values.order_by || undefined,
  };
}
