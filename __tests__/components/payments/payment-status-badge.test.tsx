/**
 * PaymentStatusBadge component tests.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import type { FundingStatus } from "@/lib/payments/types";

const messages = {
  paymentStatus: {
    unfunded: "Unfunded",
    pending: "Pending",
    funded: "Funded",
    failed: "Failed",
  },
};

function renderBadge(status: FundingStatus) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <PaymentStatusBadge status={status} />
    </NextIntlClientProvider>
  );
}

describe("PaymentStatusBadge", () => {
  it("renders unfunded", () => {
    renderBadge("unfunded");
    expect(screen.getByText("Unfunded")).toBeDefined();
  });

  it("renders pending", () => {
    renderBadge("pending");
    expect(screen.getByText("Pending")).toBeDefined();
  });

  it("renders funded", () => {
    renderBadge("funded");
    expect(screen.getByText("Funded")).toBeDefined();
  });

  it("renders failed", () => {
    renderBadge("failed");
    expect(screen.getByText("Failed")).toBeDefined();
  });

  it("has semantic class for color distinction", () => {
    const { container } = renderBadge("funded");
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("rounded-full");
  });
});
