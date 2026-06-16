"use client";

import { useTranslations } from "next-intl";
import type { SkillItem, CategoryItem } from "@/lib/marketplace/types";

export interface FilterValues {
  governorate: string;
  is_available: string; // "" | "true" | "false"
  skill_id: string;
  category_id: string;
  min_rating: string;
  order_by: string;
}

interface TechnicianFiltersProps {
  values: FilterValues;
  governorates: string[];
  categories: CategoryItem[];
  skills: SkillItem[];
  skillsLoading: boolean;
  categoriesLoading: boolean;
  onChange: (values: FilterValues) => void;
}

export function TechnicianFilters({
  values,
  governorates,
  categories,
  skills,
  skillsLoading,
  categoriesLoading,
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
      {/* Skill */}
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-skill" className="text-xs font-medium text-foreground-muted dark:text-gray-400">
          {t("skill")}
        </label>
        <select
          id="filter-skill"
          value={values.skill_id}
          onChange={(e) => update("skill_id", e.target.value)}
          disabled={skillsLoading}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
        >
          <option value="">{t("allSkills")}</option>
          {skills.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-category" className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {t("category")}
        </label>
        <select
          id="filter-category"
          value={values.category_id}
          onChange={(e) => update("category_id", e.target.value)}
          disabled={categoriesLoading}
          className="rounded-lg border border-border-warm bg-surface-pure px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Governorate */}
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-governorate" className="text-xs font-medium text-foreground-muted dark:text-gray-400">
          {t("governorate")}
        </label>
        <select
          id="filter-governorate"
          value={values.governorate}
          onChange={(e) => update("governorate", e.target.value)}
          className="rounded-lg border border-border-warm bg-surface-pure px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
        >
          <option value="">{t("allGovernorates")}</option>
          {governorates.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Availability */}
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-availability" className="text-xs font-medium text-foreground-muted dark:text-gray-400">
          {t("availability")}
        </label>
        <select
          id="filter-availability"
          value={values.is_available}
          onChange={(e) => update("is_available", e.target.value)}
          className="rounded-lg border border-border-warm bg-surface-pure px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
        >
          <option value="">{t("all")}</option>
          <option value="true">{t("availableOnly")}</option>
          <option value="false">{t("unavailableOnly")}</option>
        </select>
      </div>

      {/* Min rating */}
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-rating" className="text-xs font-medium text-foreground-muted dark:text-gray-400">
          {t("minRating")}
        </label>
        <select
          id="filter-rating"
          value={values.min_rating}
          onChange={(e) => update("min_rating", e.target.value)}
          className="rounded-lg border border-border-warm bg-surface-pure px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
        >
          <option value="">{t("anyRating")}</option>
          <option value="4.5">4.5+</option>
          <option value="4">4+</option>
          <option value="3.5">3.5+</option>
          <option value="3">3+</option>
        </select>
      </div>

      {/* Sort */}
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-sort" className="text-xs font-medium text-foreground-muted dark:text-gray-400">
          {t("sortBy")}
        </label>
        <select
          id="filter-sort"
          value={values.order_by}
          onChange={(e) => update("order_by", e.target.value)}
          className="rounded-lg border border-border-warm bg-surface-pure px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
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
