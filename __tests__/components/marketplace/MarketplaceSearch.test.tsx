import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";

// Mock next-intl
vi.mock("next-intl", () => {
  const translations: Record<string, string> = {
    searchPlaceholder: "Search by name or skill...",
    searchHint: "Type to search technicians by name, job title, or biography. Press Enter to submit.",
    clearSearch: "Clear search",
  };
  return {
    useTranslations: () => (key: string) => translations[key] || key,
  };
});

describe("MarketplaceSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders search input with placeholder", () => {
    render(<MarketplaceSearch value="" onChange={() => {}} onImmediateSubmit={() => {}} />);
    const input = screen.getByPlaceholderText("Search by name or skill...");
    expect(input).toBeInTheDocument();
  });

  it("calls onChange after debounce", () => {
    const onChange = vi.fn();
    render(<MarketplaceSearch value="" onChange={onChange} onImmediateSubmit={() => {}} />);
    const input = screen.getByPlaceholderText("Search by name or skill...");
    fireEvent.change(input, { target: { value: "test" } });
    // Fast-forward past debounce
    vi.advanceTimersByTime(400);
    expect(onChange).toHaveBeenCalledWith("test");
  });

  it("displays the current value", () => {
    render(<MarketplaceSearch value="current value" onChange={() => {}} onImmediateSubmit={() => {}} />);
    const input = screen.getByPlaceholderText("Search by name or skill...");
    expect(input).toHaveValue("current value");
  });

  it("renders search hint", () => {
    render(<MarketplaceSearch value="" onChange={() => {}} onImmediateSubmit={() => {}} />);
    expect(screen.getByText(/Type to search/)).toBeInTheDocument();
  });
});
