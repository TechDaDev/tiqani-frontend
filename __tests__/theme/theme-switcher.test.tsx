import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeSwitcher } from "@/components/controls/theme-switcher";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("ThemeSwitcher", () => {
  it("renders a theme button", () => {
    renderWithProviders(<ThemeSwitcher />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("has accessible label", () => {
    renderWithProviders(<ThemeSwitcher />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label");
  });
});
