"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { X, SlidersHorizontal } from "lucide-react";
import { TechnicianFilters, type FilterValues } from "./TechnicianFilters";
import type { SkillItem, CategoryItem } from "@/lib/marketplace/types";

interface MarketplaceFilterDrawerProps {
  values: FilterValues;
  governorates: string[];
  categories: CategoryItem[];
  skills: SkillItem[];
  skillsLoading: boolean;
  categoriesLoading: boolean;
  onChange: (values: FilterValues) => void;
}

export function MarketplaceFilterDrawer({
  values,
  governorates,
  categories,
  skills,
  skillsLoading,
  categoriesLoading,
  onChange,
}: MarketplaceFilterDrawerProps) {
  const t = useTranslations("marketplace");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [open, setOpen] = useState(false);
  const [draftValues, setDraftValues] = useState<FilterValues>(values);
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveRef = useRef<Element | null>(null);

  // Sync draft when opened
  useEffect(() => {
    if (open) {
      setDraftValues(values);
    }
  }, [open, values]);

  // Focus trap + scroll lock
  useEffect(() => {
    if (!open) return;
    previousActiveRef.current = document.activeElement;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
      // Basic focus trap
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      if (previousActiveRef.current instanceof HTMLElement) {
        previousActiveRef.current.focus();
      }
    };
  }, [open]);

  const handleApply = () => {
    onChange(draftValues);
    setOpen(false);
  };

  const handleReset = () => {
    const empty: FilterValues = {
      governorate: "",
      is_available: "",
      skill_id: "",
      category_id: "",
      min_rating: "",
      order_by: values.order_by, // preserve sort order
    };
    setDraftValues(empty);
  };

  const activeFilterCount = [
    values.governorate,
    values.is_available,
    values.skill_id,
    values.category_id,
    values.min_rating,
  ].filter(Boolean).length;

  return (
    <>
      {/* Open button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-border-warm bg-surface-pure px-4 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-warm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 lg:hidden"
        aria-label={t("filterDrawerButton")}
        aria-expanded={open}
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        {t("filterButtonLabel")}
        {activeFilterCount > 0 && (
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("filterDrawerTitle")}
        className={`fixed inset-y-0 z-50 w-full max-w-sm bg-surface-pure shadow-xl transition-transform duration-300 dark:bg-gray-900 ${
          open ? "translate-x-0" : "translate-x-full"
        } ${isRtl ? "left-0" : "right-0"}`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-warm px-4 py-3 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              {t("filterButtonLabel")}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-foreground-muted hover:bg-surface-warm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700"
              aria-label={t("closeFilterDrawer")}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <TechnicianFilters
              values={draftValues}
              governorates={governorates}
              categories={categories}
              skills={skills}
              skillsLoading={skillsLoading}
              categoriesLoading={categoriesLoading}
              onChange={setDraftValues}
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-border-warm px-4 py-3 dark:border-gray-700">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 rounded-lg border border-border-warm bg-surface-pure px-4 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-warm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {t("resetFilters")}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {t("applyFilters")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
