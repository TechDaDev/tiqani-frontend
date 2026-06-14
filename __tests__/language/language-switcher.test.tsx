import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { LanguageSwitcher } from "@/components/controls/language-switcher";

vi.mock("next/navigation", () => ({
  useParams: () => ({ locale: "en" }),
  usePathname: () => "/en",
}));

vi.mock("@/lib/i18n/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ replace: vi.fn() }),
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/lib/i18n/routing", () => ({
  locales: ["en", "ar", "ku"],
  defaultLocale: "en",
  localeLabels: { en: "English", ar: "العربية", ku: "کوردی" },
  localeDirections: { en: "ltr", ar: "rtl", ku: "rtl" },
  routing: {
    locales: ["en", "ar", "ku"],
    defaultLocale: "en",
    localePrefix: "always",
  },
}));

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("LanguageSwitcher", () => {
  it("renders a language button", () => {
    renderWithProviders(<LanguageSwitcher />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("displays current locale code", () => {
    renderWithProviders(<LanguageSwitcher />);
    expect(screen.getByText("en")).toBeInTheDocument();
  });
});
