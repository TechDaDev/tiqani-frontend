"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { FilterValues } from "./TechnicianFilters";

interface ActiveFiltersProps {
  values: FilterValues;
  searchValue: string;
  skillsMap: Record<string, string>;
  categoriesMap: Record<string, string>;
  onRemoveFilter: (key: keyof FilterValues) => void;
  onRemoveSearch: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  values,
  searchValue,
  skillsMap,
  categoriesMap,
  onRemoveFilter,
  onRemoveSearch,
  onClearAll,
}: ActiveFiltersProps) {
  const t = useTranslations("marketplace.filters");
  const tCommon = useTranslations("common");

  const filters: Array<{ key: string; label: string; onRemove: () => void }> = [];

  if (searchValue) {
    filters.push({
      key: "search",
      label: `"${searchValue}"`,
      onRemove: onRemoveSearch,
    });
  }

  if (values.category_id) {
    const name = categoriesMap[values.category_id] || values.category_id;
    filters.push({
      key: "category",
      label: `${t("category")}: ${name}`,
      onRemove: () => onRemoveFilter("category_id" as keyof FilterValues),
    });
  }

  if (values.skill_id) {
    const name = skillsMap[values.skill_id] || values.skill_id;
    filters.push({
      key: "skill",
      label: `${t("skill")}: ${name}`,
      onRemove: () => onRemoveFilter("skill_id" as keyof FilterValues),
    });
  }

  if (values.governorate) {
    filters.push({
      key: "governorate",
      label: `${t("governorate")}: ${values.governorate}`,
      onRemove: () => onRemoveFilter("governorate"),
    });
  }

  if (values.is_available === "true") {
    filters.push({
      key: "availability",
      label: t("availableOnly"),
      onRemove: () => onRemoveFilter("is_available"),
    });
  } else if (values.is_available === "false") {
    filters.push({
      key: "availability",
      label: t("unavailableOnly"),
      onRemove: () => onRemoveFilter("is_available"),
    });
  }

  if (values.min_rating) {
    filters.push({
      key: "rating",
      label: `${t("minRating")}: ${values.min_rating}+`,
      onRemove: () => onRemoveFilter("min_rating" as keyof FilterValues),
    });
  }

  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("activeFilters")}>
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        >
          {filter.label}
          <button
            type="button"
            onClick={filter.onRemove}
            className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:hover:bg-blue-800"
            aria-label={tCommon("remove", { filter: filter.label })}
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </span>
      ))}

      {filters.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-red-600 hover:text-red-700 focus:outline-none focus:underline dark:text-red-400 dark:hover:text-red-300"
        >
          {t("clearAll")}
        </button>
      )}
    </div>
  );
}
