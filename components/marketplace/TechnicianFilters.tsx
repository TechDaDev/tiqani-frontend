"use client";

import { useTranslations } from "next-intl";

export interface FilterValues {
  governorate: string;
  is_available: string; // "" | "true" | "false"
  order_by: string;
}

interface TechnicianFiltersProps {
  values: FilterValues;
  governorates: string[];
  onChange: (values: FilterValues) => void;
}

export function TechnicianFilters({
  values,
  governorates,
  onChange,
}: TechnicianFiltersProps) {
  const t = useTranslations("marketplace.filters");

  const update = (key: keyof FilterValues, value: string) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div
      className="flex flex-wrap items-end gap-3"
      role="group"
      aria-label={t("filterGroupLabel")}
    >
      {/* Governorate */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-governorate"
          className="text-xs font-medium text-gray-600 dark:text-gray-400"
        >
          {t("governorate")}
        </label>
        <select
          id="filter-governorate"
          value={values.governorate}
          onChange={(e) => update("governorate", e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
        >
          <option value="">{t("allGovernorates")}</option>
          {governorates.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Availability */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-availability"
          className="text-xs font-medium text-gray-600 dark:text-gray-400"
        >
          {t("availability")}
        </label>
        <select
          id="filter-availability"
          value={values.is_available}
          onChange={(e) => update("is_available", e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
        >
          <option value="">{t("all")}</option>
          <option value="true">{t("availableOnly")}</option>
          <option value="false">{t("unavailableOnly")}</option>
        </select>
      </div>

      {/* Sort */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-sort"
          className="text-xs font-medium text-gray-600 dark:text-gray-400"
        >
          {t("sortBy")}
        </label>
        <select
          id="filter-sort"
          value={values.order_by}
          onChange={(e) => update("order_by", e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
        >
          <option value="-rate">{t("highestRated")}</option>
          <option value="rate">{t("lowestRated")}</option>
          <option value="-years_of_expertise">{t("mostExperienced")}</option>
          <option value="years_of_expertise">{t("leastExperienced")}</option>
          <option value="full_name">{t("nameAZ")}</option>
          <option value="-full_name">{t("nameZA")}</option>
        </select>
      </div>
    </div>
  );
}
