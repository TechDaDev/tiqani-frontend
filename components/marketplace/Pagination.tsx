"use client";

import { useTranslations } from "next-intl";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const t = useTranslations("marketplace");
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  if (totalPages <= 1) return null;

  /** Build a compact page-number window around the current page. */
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const delta = 2;
    const range: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }
    const result: (number | "ellipsis")[] = [];
    let prev = 0;
    for (const page of range) {
      if (page - prev > 1) result.push("ellipsis");
      result.push(page);
      prev = page;
    }
    return result;
  };

  const pages = getPageNumbers();

  return (
    <nav aria-label={t("paginationLabel")} className="mt-8 flex items-center justify-center gap-1">
      {/* Previous */}
      <button
        type="button"
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label={t("previousPage")}
        className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex h-9 w-9 items-center justify-center text-sm text-gray-400"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            aria-label={t("pageLabel", { page })}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        disabled={isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label={t("nextPage")}
        className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}
