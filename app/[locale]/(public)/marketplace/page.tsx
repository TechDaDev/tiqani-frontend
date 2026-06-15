"use client";

import { useCallback, useEffect, useState } from "react";
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
import { TechnicianFilters, type FilterValues } from "@/components/marketplace/TechnicianFilters";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";
import { Pagination } from "@/components/marketplace/Pagination";
import {
  fetchTechnicians,
  type TechnicianListItem,
  type PaginatedResponse,
} from "@/lib/api/marketplace";

const PAGE_SIZE = 20;

export default function MarketplacePage() {
  const t = useTranslations("marketplace");
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── State ──────────────────────────────────────────────────
  const [data, setData] = useState<PaginatedResponse<TechnicianListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived from URL query params
  const currentPage = Number(searchParams.get("page")) || 1;
  const governorate = searchParams.get("governorate") || "";
  const isAvailable = searchParams.get("is_available") || "";
  const orderBy = searchParams.get("order_by") || "-rate";
  const searchQuery = searchParams.get("q") || "";

  // ── URL helpers ─────────────────────────────────────────────
  const buildHref = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      // Reset page when changing filters
      if (!("page" in overrides)) {
        params.delete("page");
      }
      const qs = params.toString();
      return `/marketplace${qs ? `?${qs}` : ""}`;
    },
    [searchParams]
  );

  // ── Data fetching ───────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchTechnicians({
          page: currentPage,
          page_size: PAGE_SIZE,
          governorate: governorate || undefined,
          is_available: isAvailable ? isAvailable === "true" : undefined,
          order_by: orderBy || undefined,
        });
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("loadError"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [currentPage, governorate, isAvailable, orderBy, t]);

  // ── Filter change handler ───────────────────────────────────
  const handleFilterChange = (values: FilterValues) => {
    const href = buildHref({
      governorate: values.governorate || undefined,
      is_available: values.is_available || undefined,
      order_by: values.order_by || undefined,
    });
    router.push(href);
  };

  const handleSearchChange = (value: string) => {
    // Currently a placeholder — backend has no free-text search.
    // When search is added, this should push with ?q=value.
    const href = buildHref({ q: value || undefined });
    router.push(href);
  };

  const handlePageChange = (page: number) => {
    const href = buildHref({ page: String(page) });
    router.push(href);
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <>
      <PublicHeader />
      <main id="main-content">
        <ResponsiveContainer className="py-8 sm:py-12" as="section">
          <SectionHeading
            title={t("title")}
            description={t("description")}
            as="h1"
          />

          {/* Search + Filters */}
          <div className="mt-8 space-y-4">
            <MarketplaceSearch value={searchQuery} onChange={handleSearchChange} />
            <TechnicianFilters
              values={{ governorate, is_available: isAvailable, order_by: orderBy }}
              governorates={[]}
              onChange={handleFilterChange}
            />
          </div>

          {/* Results */}
          <div className="mt-8">
            {loading ? (
              <CardSkeleton count={6} />
            ) : error ? (
              <ErrorState
                title={t("loadError")}
                message={error}
                onRetry={() => window.location.reload()}
              />
            ) : data && data.results.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400" role="status">
                  {t("resultsCount", { count: data.count })}
                </p>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {data.results.map((technician) => (
                    <TechnicianCard key={technician.user_id} technician={technician} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalCount={data.count}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyState
                title={t("noResults")}
                description={t("noResultsDesc")}
              />
            )}
          </div>
        </ResponsiveContainer>
      </main>
      <PublicFooter />
    </>
  );
}
