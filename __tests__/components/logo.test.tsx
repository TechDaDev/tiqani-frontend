import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "@/components/shared/logo";

describe("Logo", () => {
  it("renders a link to the locale homepage", () => {
    render(<Logo locale="en" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/en");
  });

  it("has accessible label", () => {
    render(<Logo locale="en" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", "Tiqani");
  });
});
