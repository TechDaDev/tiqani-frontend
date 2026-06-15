"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { SectionHeading } from "@/components/shared/section-heading";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TechnicianCard } from "@/components/marketplace/TechnicianCard";
import {
  TechnicianFilters,
  type FilterValues,
} from "@/components/marketplace/TechnicianFilters";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";
import { Pagination } from "@/components/marketplace/Pagination";
import { ActiveFilters } from "@/components/marketplace/ActiveFilters";
import { MarketplaceFilterDrawer } from "@/components/marketplace/MarketplaceFilterDrawer";
import {
  parseMarketplaceQuery,
  serializeMarketplaceQuery,
  normalizeMarketplaceQuery,
  updateMarketplaceQuery,
  clearMarketplaceFilters,
  getActiveFilterCount,
  queryToFilterValues,
  filterValuesToQuery,
  type MarketplaceQuery,
} from "@/lib/marketplace/query";
import { fetchTechnicians, fetchSkills, fetchCategories } from "@/lib/marketplace/api";
import type { TechnicianListItem, PaginatedResponse, SkillItem, CategoryItem } from "@/lib/marketplace/types";

const PAGE_SIZE = 20;

export default function MarketplacePage() {
  const t = useTranslations("marketplace");
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);

  // ── Parse URL state ─────────────────────────────────────────
  const query = parseMarketplaceQuery(searchParams);

  // ── Data state ───────────────────────────────────────────────
  const [data, setData] = useState<PaginatedResponse<TechnicianListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Build lookup maps for active filter chips
  const skillsMap: Record<string, string> = {};
  skills.forEach((s) => { skillsMap[s.id] = s.name; });
  const categoriesMap: Record<string, string> = {};
  categories.forEach((c) => { categoriesMap[c.id] = c.name; });

  // ── URL navigation helper ────────────────────────────────────
  const navigate = useCallback(
    (newQuery: MarketplaceQuery) => {
      const normalized = normalizeMarketplaceQuery(newQuery);
      const params = serializeMarketplaceQuery(normalized);
      const qs = params.toString();
      router.push(`/marketplace${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router]
  );

  // ── Load reference data ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [skillsResult, catsResult] = await Promise.all([
          fetchSkills(),
          fetchCategories(),
        ]);
        if (!cancelled) {
          setSkills(skillsResult);
          setSkillsLoading(false);
          setCategories(catsResult.results);
          setCategoriesLoading(false);
        }
      } catch {
        if (!cancelled) {
          setSkillsLoading(false);
          setCategoriesLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // ── Fetch technicians ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchTechnicians(query);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : typeof err === "object" && err !== null
                ? String((err as Record<string, unknown>).detail || t("loadError"))
                : t("loadError");
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.search, query.category_id, query.skill_id, query.governorate, query.is_available, query.min_rating, query.order_by, query.page, query.page_size, t]);

  // ── Handlers ─────────────────────────────────────────────────
  const handleSearchChange = useCallback(
    (searchValue: string) => {
      navigate(updateMarketplaceQuery(query, { search: searchValue || undefined }));
    },
    [navigate, query]
  );

  const handleImmediateSubmit = useCallback(
    (searchValue: string) => {
      navigate(updateMarketplaceQuery(query, { search: searchValue || undefined }));
    },
    [navigate, query]
  );

  const handleFilterChange = useCallback(
    (values: FilterValues) => {
      navigate(updateMarketplaceQuery(query, filterValuesToQuery(values)));
    },
    [navigate, query]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      navigate(updateMarketplaceQuery(query, { page }));
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [navigate, query]
  );

  const handleRemoveFilter = useCallback(
    (key: keyof FilterValues) => {
      navigate(updateMarketplaceQuery(query, { [key]: undefined }));
    },
    [navigate, query]
  );

  const handleRemoveSearch = useCallback(() => {
    navigate(updateMarketplaceQuery(query, { search: undefined }));
  }, [navigate, query]);

  const handleClearAll = useCallback(() => {
    navigate(clearMarketplaceFilters(query));
  }, [navigate, query]);

  const filterValues = queryToFilterValues(query);
  const activeFilterCount = getActiveFilterCount(query);

  return (
    <>
      <PublicHeader />
      <main id="main-content">
        <ResponsiveContainer className="py-8 sm:py-12" as="section">
          <SectionHeading title={t("title")} description={t("description")} as="h1" />

          {/* Search */}
          <div className="mt-8">
            <MarketplaceSearch
              value={query.search || ""}
              onChange={handleSearchChange}
              onImmediateSubmit={handleImmediateSubmit}
            />
          </div>

          {/* Desktop filters */}
          <div className="mt-4 hidden lg:block">
            <TechnicianFilters
              values={filterValues}
              governorates={[]}
              categories={categories}
              skills={skills}
              skillsLoading={skillsLoading}
              categoriesLoading={categoriesLoading}
              onChange={handleFilterChange}
            />
          </div>

          {/* Mobile drawer trigger */}
          <div className="mt-4 flex items-center justify-between lg:hidden">
            <MarketplaceFilterDrawer
              values={filterValues}
              governorates={[]}
              categories={categories}
              skills={skills}
              skillsLoading={skillsLoading}
              categoriesLoading={categoriesLoading}
              onChange={handleFilterChange}
            />
            {activeFilterCount > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("activeFilterCount", { count: activeFilterCount })}
              </span>
            )}
          </div>

          {/* Active filter chips */}
          <div className="mt-4">
            <ActiveFilters
              values={filterValues}
              searchValue={query.search || ""}
              skillsMap={skillsMap}
              categoriesMap={categoriesMap}
              onRemoveFilter={handleRemoveFilter}
              onRemoveSearch={handleRemoveSearch}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Results */}
          <div ref={resultsRef} className="mt-8">
            {loading ? (
              <CardSkeleton count={6} />
            ) : error ? (
              <ErrorState title={t("loadError")} message={error} onRetry={() => window.location.reload()} />
            ) : data && data.results.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400" role="status">
                  {t("resultsCount", { count: data.count })}
                </p>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {data.results.map((technician) => (
                    <TechnicianCard key={technician.userId} technician={technician} />
                  ))}
                </div>
                <Pagination
                  currentPage={query.page || 1}
                  totalCount={data.count}
                  pageSize={query.page_size || PAGE_SIZE}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyState
                title={t("noResults")}
                description={activeFilterCount > 0 ? t("noResultsFilteredDesc") : t("noResultsDesc")}
              />
            )}
          </div>
        </ResponsiveContainer>
      </main>
      <PublicFooter />
    </>
  );
}
