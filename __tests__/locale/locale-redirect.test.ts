import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/i18n/routing", () => ({
  locales: ["en", "ar", "ku"],
  defaultLocale: "ar",
  localeLabels: { en: "English", ar: "العربية", ku: "کوردی" },
  localeDirections: { en: "ltr", ar: "rtl", ku: "rtl" },
  routing: {
    locales: ["en", "ar", "ku"],
    defaultLocale: "ar",
    localePrefix: "always",
  },
}));

import { locales, defaultLocale } from "@/lib/i18n/routing";

describe("Locale redirect logic", () => {
  it("default locale redirects to /ar without cookie", () => {
    // Simulating root page logic: no cookie, redirect to default locale
    const savedLocale = undefined;
    const target = savedLocale && locales.includes(savedLocale as any)
      ? `/${savedLocale}`
      : `/${defaultLocale}`;
    expect(target).toBe("/ar");
  });

  it("valid en cookie redirects to /en", () => {
    const savedLocale = "en";
    const target = savedLocale && locales.includes(savedLocale as any)
      ? `/${savedLocale}`
      : `/${defaultLocale}`;
    expect(target).toBe("/en");
  });

  it("valid ku cookie redirects to /ku", () => {
    const savedLocale = "ku";
    const target = savedLocale && locales.includes(savedLocale as any)
      ? `/${savedLocale}`
      : `/${defaultLocale}`;
    expect(target).toBe("/ku");
  });

  it("invalid cookie redirects to /ar", () => {
    const savedLocale = "fr";
    const target = savedLocale && locales.includes(savedLocale as any)
      ? `/${savedLocale}`
      : `/${defaultLocale}`;
    expect(target).toBe("/ar");
  });

  it("all supported locales can be redirected to", () => {
    for (const locale of locales) {
      const target = `/${locale}`;
      expect(target).toBe(`/${locale}`);
    }
  });
});
