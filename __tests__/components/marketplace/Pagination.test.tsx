import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "@/components/marketplace/Pagination";

// Mock next-intl
vi.mock("next-intl", () => {
  return {
    useTranslations: () => (key: string, opts?: { page?: number }) => {
      const translations: Record<string, string> = {
        paginationLabel: "Technician listing pagination",
        previousPage: "Previous page",
        nextPage: "Next page",
        pageLabel: "Page 1",
      };
      if (key === "pageLabel" && opts?.page) {
        return `Page ${opts.page}`;
      }
      return translations[key] || key;
    },
  };
});

describe("Pagination", () => {
  it("does not render when only one page", () => {
    const { container } = render(
      <Pagination currentPage={1} totalCount={10} pageSize={20} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders page buttons for multiple pages", () => {
    render(
      <Pagination currentPage={1} totalCount={50} pageSize={20} onPageChange={() => {}} />
    );
    expect(screen.getByLabelText("Page 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Page 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Page 3")).toBeInTheDocument();
  });

  it("highlights current page", () => {
    render(
      <Pagination currentPage={2} totalCount={50} pageSize={20} onPageChange={() => {}} />
    );
    const page2 = screen.getByLabelText("Page 2");
    expect(page2).toHaveAttribute("aria-current", "page");
  });

  it("calls onPageChange when page button clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalCount={50} pageSize={20} onPageChange={onPageChange} />
    );
    fireEvent.click(screen.getByLabelText("Page 2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination currentPage={1} totalCount={50} pageSize={20} onPageChange={() => {}} />
    );
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(
      <Pagination currentPage={3} totalCount={50} pageSize={20} onPageChange={() => {}} />
    );
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("renders ellipsis for large page counts", () => {
    render(
      <Pagination currentPage={5} totalCount={200} pageSize={20} onPageChange={() => {}} />
    );
    const ellipsis = screen.getAllByText("...");
    expect(ellipsis.length).toBeGreaterThanOrEqual(1);
  });
});
