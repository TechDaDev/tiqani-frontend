import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";

// Mock next-intl
vi.mock("next-intl", () => {
  const translations: Record<string, string> = {
    searchLabel: "Search technicians",
    searchPlaceholder: "Search by name or skill...",
    searchHint: "Search by name or skill. Filters and pagination apply to the current results.",
  };
  return {
    useTranslations: () => (key: string) => translations[key] || key,
  };
});

describe("MarketplaceSearch", () => {
  it("renders search input with placeholder", () => {
    render(<MarketplaceSearch value="" onChange={() => {}} />);
    const input = screen.getByPlaceholderText("Search by name or skill...");
    expect(input).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const onChange = vi.fn();
    render(<MarketplaceSearch value="" onChange={onChange} />);
    const input = screen.getByPlaceholderText("Search by name or skill...");
    fireEvent.change(input, { target: { value: "test" } });
    expect(onChange).toHaveBeenCalledWith("test");
  });

  it("displays the current value", () => {
    render(<MarketplaceSearch value="current value" onChange={() => {}} />);
    const input = screen.getByPlaceholderText("Search by name or skill...");
    expect(input).toHaveValue("current value");
  });

  it("renders search hint", () => {
    render(<MarketplaceSearch value="" onChange={() => {}} />);
    expect(screen.getByText(/Filters and pagination/)).toBeInTheDocument();
  });
});
