/**
 * FundingSummary component tests.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { FundingSummary } from "@/components/payments/funding-summary";
import type { ContractFundingStatus } from "@/lib/payments/types";

const messages = {
  funding: {
    fundingStatus: "Funding Status",
    status: "Status",
    agreedAmount: "Agreed Amount",
    escrowHeld: "Escrow Held",
    fundsNotReleased: "Funds are held in escrow and have not been released.",
  },
  paymentStatus: {
    unfunded: "Unfunded",
    pending: "Pending",
    funded: "Funded",
    failed: "Failed",
  },
};

const baseStatus: ContractFundingStatus = {
  contract_id: "abc-123",
  contract_reference: "REF001",
  funding_status: "unfunded",
  escrow_amount: "0.00",
  agreed_amount: "500000.00",
  currency: "IQD",
  active_intent: null,
};

function renderSummary(status: ContractFundingStatus, isTechnician = false) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <FundingSummary fundingStatus={status} isTechnician={isTechnician} />
    </NextIntlClientProvider>
  );
}

describe("FundingSummary", () => {
  it("renders funding status heading", () => {
    renderSummary(baseStatus);
    expect(screen.getByText("Funding Status")).toBeDefined();
  });

  it("renders agreed amount", () => {
    renderSummary(baseStatus);
    expect(screen.getByText(/500/)).toBeDefined();
  });

  it("shows escrow held", () => {
    const funded = { ...baseStatus, funding_status: "funded" as const, escrow_amount: "500000.00" };
    renderSummary(funded);
    const iqdElements = screen.getAllByText("500,000 IQD");
    expect(iqdElements.length).toBeGreaterThanOrEqual(1);
  });

  it("shows funds not released for client", () => {
    renderSummary(baseStatus, false);
    expect(screen.getByText(/not been released/)).toBeDefined();
  });

  it("does not show release notice for technician", () => {
    renderSummary(baseStatus, true);
    expect(screen.queryByText(/not been released/)).toBeNull();
  });
});
