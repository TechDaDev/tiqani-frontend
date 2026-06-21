import { describe, it, expect } from "vitest";
import { mapSettlement, mapSettlementEligibility, mapFinancialSummary } from "@/lib/settlement/mappers";
import { isSettlementCompleted } from "@/lib/settlement/status";
import { canReleaseEscrow } from "@/lib/settlement/actions";
import type { SettlementStatus } from "@/lib/settlement/types";

describe("Settlement mappers", () => {
  it("maps settlement response correctly", () => {
    const result = mapSettlement({
      id: "550e8400-e29b-41d4-a716-446655440000",
      contract: "660e8400-e29b-41d4-a716-446655440000",
      released_principal: "500000.00",
      technician_net_amount: "450000.00",
      technician_commission_amount: "50000.00",
      client_service_fee_amount: "25000.00",
      total_platform_fee: "75000.00",
      currency: "IQD",
      status: "completed",
      initiated_at: "2026-06-21T10:00:00Z",
    });
    expect(result.released_principal).toBe("500000.00");
    expect(result.technician_net_amount).toBe("450000.00");
    expect(result.status).toBe("completed");
  });

  it("maps eligibility", () => {
    const eligible = mapSettlementEligibility({ eligible: true, reason: null });
    expect(eligible.eligible).toBe(true);
    expect(eligible.reason).toBeNull();

    const ineligible = mapSettlementEligibility({ eligible: false, reason: "Not completed." });
    expect(ineligible.eligible).toBe(false);
    expect(ineligible.reason).toBe("Not completed.");
  });

  it("maps financial summary with settlement", () => {
    const result = mapFinancialSummary({
      contract_id: "660e8400-e29b-41d4-a716-446655440000",
      contract_status: "completed",
      agreed_amount: "500000.00",
      escrow_amount: "0.00",
      payment_breakdown: {
        contract_amount: "500000.00",
        technician_commission_amount: "50000.00",
        client_service_fee_amount: "25000.00",
        total_platform_fee: "75000.00",
        client_total_amount: "525000.00",
        technician_net_amount: "450000.00",
        currency: "IQD",
      },
      settlement: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        status: "completed",
        released_principal: "500000.00",
        technician_net_amount: "450000.00",
        technician_commission_amount: "50000.00",
        client_service_fee_amount: "25000.00",
        total_platform_fee: "75000.00",
        completed_at: "2026-06-21T10:00:00Z",
      },
    });
    expect(result.payment_breakdown.contract_amount).toBe("500000.00");
    expect(result.settlement?.status).toBe("completed");
  });
});

describe("Settlement helpers", () => {
  it("isSettlementCompleted", () => {
    expect(isSettlementCompleted("completed" as SettlementStatus)).toBe(true);
    expect(isSettlementCompleted("pending" as SettlementStatus)).toBe(false);
  });

  it("canReleaseEscrow", () => {
    expect(canReleaseEscrow("client", "completed")).toBe(true);
    expect(canReleaseEscrow("technician", "completed")).toBe(false);
    expect(canReleaseEscrow("client", "active")).toBe(false);
    expect(canReleaseEscrow("client", "completed", "completed" as SettlementStatus)).toBe(false);
  });
});
