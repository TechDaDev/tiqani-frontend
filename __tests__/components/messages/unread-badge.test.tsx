/**
 * Tests for UnreadBadge component.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UnreadBadge } from "@/components/messages/unread-badge";
import { NextIntlClientProvider } from "next-intl";

const messages = {
  unreadMessages: {
    ariaLabel: "{count} unread {count, plural, one {message} other {messages}}",
  },
};

function renderBadge(count: number, max = 99) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <UnreadBadge count={count} max={max} />
    </NextIntlClientProvider>
  );
}

describe("UnreadBadge", () => {
  it("renders nothing for zero count", () => {
    const { container } = renderBadge(0);
    expect(container.firstChild).toBeNull();
  });

  it("renders count for single digit", () => {
    renderBadge(3);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders count for two digits", () => {
    renderBadge(42);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders 99+ for count above max", () => {
    renderBadge(100);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("renders 99+ for count of exactly max+1", () => {
    renderBadge(100, 99);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("renders exact count at exactly max", () => {
    renderBadge(99);
    expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("has accessible label", () => {
    renderBadge(5);
    const badge = screen.getByRole("status");
    expect(badge.getAttribute("aria-label")).toContain("5");
  });

  it("has correct styling classes", () => {
    renderBadge(1);
    const badge = screen.getByRole("status");
    expect(badge.className).toContain("rounded-full");
    expect(badge.className).toContain("bg-blue-600");
    expect(badge.className).toContain("text-white");
  });

  it("handles negative count like zero", () => {
    const { container } = renderBadge(-1);
    expect(container.firstChild).toBeNull();
  });
});
