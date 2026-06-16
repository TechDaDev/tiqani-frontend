/**
 * FundingAction component tests.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { FundingAction } from "@/components/payments/funding-action";
import type { PaymentIntent } from "@/lib/payments/types";

const messages = {
  funding: {
    startFunding: "Start Funding",
    starting: "Starting...",
    intentCreated: "Payment intent created successfully",
    completePayment: "Complete the payment using the sandbox controls below.",
    fundingError: "An error occurred.",
  },
};

const mockIntent: PaymentIntent = {
  id: "intent-1",
  contract: "contract-1",
  user: "user-1",
  amount: "525000.00",
  currency: "IQD",
  purpose: "contract_funding",
  provider: "sandbox",
  provider_reference: "",
  status: "pending",
  metadata: {},
  paid_at: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

function renderAction(
  contractId: string,
  fundingStatus: "unfunded" | "pending" | "funded" | "failed",
  onStart: () => Promise<PaymentIntent>,
  disabled = false
) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <FundingAction
        contractId={contractId}
        fundingStatus={fundingStatus}
        onStartFunding={onStart}
        disabled={disabled}
      />
    </NextIntlClientProvider>
  );
}

describe("FundingAction", () => {
  it("shows start button for unfunded", () => {
    const onStart = vi.fn().mockResolvedValue(mockIntent);
    renderAction("c1", "unfunded", onStart);
    expect(screen.getByText("Start Funding")).toBeDefined();
  });

  it("shows start button for failed", () => {
    const onStart = vi.fn().mockResolvedValue(mockIntent);
    renderAction("c1", "failed", onStart);
    expect(screen.getByText("Start Funding")).toBeDefined();
  });

  it("does not show button for funded", () => {
    const onStart = vi.fn().mockResolvedValue(mockIntent);
    renderAction("c1", "funded", onStart);
    expect(screen.queryByText("Start Funding")).toBeNull();
  });

  it("does not show button for pending", () => {
    const onStart = vi.fn().mockResolvedValue(mockIntent);
    renderAction("c1", "pending", onStart);
    expect(screen.queryByText("Start Funding")).toBeNull();
  });

  it("calls onStartFunding on click", async () => {
    const onStart = vi.fn().mockResolvedValue(mockIntent);
    renderAction("c1", "unfunded", onStart);
    const btn = screen.getByText("Start Funding");
    fireEvent.click(btn);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("shows success message after intent created", async () => {
    const onStart = vi.fn().mockResolvedValue(mockIntent);
    renderAction("c1", "unfunded", onStart);
    const btn = screen.getByText("Start Funding");
    fireEvent.click(btn);
    const success = await screen.findByText("Payment intent created successfully");
    expect(success).toBeDefined();
  });

  it("shows error message on failure", async () => {
    const onStart = vi.fn().mockRejectedValue(new Error("Server error"));
    renderAction("c1", "unfunded", onStart);
    const btn = screen.getByText("Start Funding");
    fireEvent.click(btn);
    const error = await screen.findByText("Server error");
    expect(error).toBeDefined();
  });

  it("disables button while loading", async () => {
    const onStart = vi.fn().mockImplementation(() => new Promise(() => {})); // never resolves
    renderAction("c1", "unfunded", onStart);
    const btn = screen.getByText("Start Funding");
    fireEvent.click(btn);
    // Button text changes to "Starting..." when loading
    expect(screen.getByText("Starting...")).toBeDefined();
  });
});
