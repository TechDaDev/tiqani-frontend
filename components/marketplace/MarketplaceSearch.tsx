"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";

interface MarketplaceSearchProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * A text search placeholder that communicates the current
 * search-field limitation (no free-text search on the backend).
 * The input still accepts text so future backend search can plug in.
 */
export function MarketplaceSearch({ value, onChange }: MarketplaceSearchProps) {
  const t = useTranslations("marketplace");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <label htmlFor="marketplace-search" className="sr-only">
        {t("searchLabel")}
      </label>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        ref={inputRef}
        id="marketplace-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400"
        aria-describedby="search-help-text"
      />
      <p id="search-help-text" className="mt-1 text-xs text-gray-400">
        {t("searchHint")}
      </p>
    </div>
  );
}
