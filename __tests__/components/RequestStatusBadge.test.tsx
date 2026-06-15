/**
 * Tests for RequestStatusBadge component.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// next-intl mock is provided by setup.ts
// Default mock returns keys as-is via `t => t`

describe("RequestStatusBadge", () => {
  it("renders PENDING with warning tone", () => {
    const { container } = render(<RequestStatusBadge status="PENDING" />);
    expect(screen.getByText("requestStatus.pending")).toBeDefined();
    expect(container.innerHTML).toContain("yellow");
  });

  it("renders ACCEPTED with success tone", () => {
    const { container } = render(<RequestStatusBadge status="ACCEPTED" />);
    expect(screen.getByText("requestStatus.accepted")).toBeDefined();
    expect(container.innerHTML).toContain("green");
  });

  it("renders DECLINED with danger tone", () => {
    const { container } = render(<RequestStatusBadge status="DECLINED" />);
    expect(screen.getByText("requestStatus.declined")).toBeDefined();
    expect(container.innerHTML).toContain("red");
  });

  it("renders CANCELLED with secondary tone", () => {
    const { container } = render(<RequestStatusBadge status="CANCELLED" />);
    expect(screen.getByText("requestStatus.cancelled")).toBeDefined();
    expect(container.innerHTML).toContain("gray");
  });

  it("renders WITHDRAWN with secondary tone", () => {
    const { container } = render(<RequestStatusBadge status="WITHDRAWN" />);
    expect(screen.getByText("requestStatus.withdrawn")).toBeDefined();
    expect(container.innerHTML).toContain("gray");
  });

  it("handles unknown status gracefully", () => {
    const { container } = render(<RequestStatusBadge status={"UNKNOWN" as any} />);
    expect(screen.getByText("requestStatus.unknown")).toBeDefined();
    expect(container.innerHTML).toContain("blue");
  });
});
