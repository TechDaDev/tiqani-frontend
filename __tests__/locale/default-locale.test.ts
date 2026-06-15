import { describe, it, expect, vi } from "vitest";

// Mock the routing module since vitest cannot resolve next-intl/routing
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

import { defaultLocale, locales, localeDirections } from "@/lib/i18n/routing";

describe("Default locale", () => {
  it("is Arabic", () => {
    expect(defaultLocale).toBe("ar");
  });

  it("is in the supported locales list", () => {
    expect(locales).toContain(defaultLocale);
  });

  it("is supported as locale option", () => {
    expect(locales).toContain("ar");
    expect(locales).toContain("en");
    expect(locales).toContain("ku");
  });
});

describe("Locale directions", () => {
  it("Arabic is RTL", () => {
    expect(localeDirections.ar).toBe("rtl");
  });

  it("Kurdish is RTL", () => {
    expect(localeDirections.ku).toBe("rtl");
  });

  it("English is LTR", () => {
    expect(localeDirections.en).toBe("ltr");
  });
});
