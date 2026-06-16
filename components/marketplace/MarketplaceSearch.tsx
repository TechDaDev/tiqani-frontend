"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useCallback, useEffect } from "react";
import { X, Search } from "lucide-react";

interface MarketplaceSearchProps {
  value: string;
  onChange: (value: string) => void;
  onImmediateSubmit: (value: string) => void;
}

/**
 * Real search input with 300ms debounce, Enter submission, and clear button.
 * The search parameter is sent to the Django backend which performs
 * icontains matching on full_name, job_title, and about fields.
 */
export function MarketplaceSearch({
  value,
  onChange,
  onImmediateSubmit,
}: MarketplaceSearchProps) {
  const t = useTranslations("marketplace");
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value changes (e.g., Back/Forward navigation)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useCallback(
    (val: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChange(val);
      }, 300);
    },
    [onChange]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    debouncedOnChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      onImmediateSubmit(localValue);
    }
  };

  const handleClear = () => {
    setLocalValue("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onChange("");
  };

  return (
    <div className="relative">
      <label htmlFor="marketplace-search" className="sr-only">
        {t("searchPlaceholder")}
      </label>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-neutral-soft" aria-hidden="true" />
      </div>
      <input
        ref={inputRef}
        id="marketplace-search"
        type="search"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={t("searchPlaceholder")}
        className="w-full rounded-xl border border-border-warm bg-surface-pure py-2.5 pl-10 pr-10 text-sm text-foreground placeholder-foreground-muted focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-soft hover:text-foreground-muted focus:outline-none focus:text-foreground-muted dark:hover:text-gray-300"
          aria-label={t("clearSearch")}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
      <p id="search-help-text" className="mt-1 text-xs text-neutral-soft">
        {t("searchHint")}
      </p>
    </div>
  );
}
