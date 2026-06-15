import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ar", "ku"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale = "ar" as const;

export const localeLabels: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  ku: "کوردی",
};

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
  ku: "rtl",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
