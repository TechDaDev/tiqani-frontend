import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

// Test the domain modules more thoroughly
import { mapSettlement, mapSettlementEligibility, mapFinancialSummary } from "@/lib/settlement/mappers";
import { isSettlementCompleted, getSettlementStatusLabel, getSettlementStatusColor } from "@/lib/settlement/status";
import { canReleaseEscrow, canViewSettlement } from "@/lib/settlement/actions";
import { mapWalletInfo, mapAvailableBalance } from "@/lib/wallet/mappers";
import { getTransactionTypeLabel, getTransactionTypeColor } from "@/lib/wallet/status";
import { mapWithdrawalRequest } from "@/lib/withdrawals/mappers";
import { getWithdrawalStatusLabel, isWithdrawalCancelable, isWithdrawalPaid, isWithdrawalFailed } from "@/lib/withdrawals/status";
import {
  canCancelWithdrawal, canStaffApprove, canStaffReject,
  canStaffProcess, canStaffConfirmPayout, canStaffRetryPayout,
} from "@/lib/withdrawals/actions";

describe("Phase 9 - Settlement domain", () => {
  it("maps settlement with all fields", () => {
    const s = mapSettlement({
      id: "a".repeat(36).replace(/./g, "a").slice(0, 36),
      contract: "b".repeat(36).replace(/./g, "b").slice(0, 36),
      released_principal: "500000.00",
      technician_net_amount: "450000.00",
      technician_commission_amount: "50000.00",
      client_service_fee_amount: "25000.00",
      total_platform_fee: "75000.00",
      currency: "IQD",
      status: "completed",
      initiated_at: "2026-06-21T10:00:00Z",
      created_at: "2026-06-21T10:00:00Z",
      updated_at: "2026-06-21T10:00:00Z",
      failure_code: "",
      failure_message: "",
    });
    expect(s.released_principal).toBe("500000.00");
    expect(s.currency).toBe("IQD");
    expect(s.status).toBe("completed");
  });

  it("handles null settlement fields", () => {
    const s = mapSettlement({});
    expect(s.released_principal).toBe("0.00");
    expect(s.technician_net_amount).toBe("0.00");
    expect(s.status).toBe("pending");
  });

  it("maps eligibility true/false", () => {
    expect(mapSettlementEligibility({ eligible: true }).eligible).toBe(true);
    expect(mapSettlementEligibility({ eligible: false }).eligible).toBe(false);
    expect(mapSettlementEligibility({ eligible: false, reason: "Blocked" }).reason).toBe("Blocked");
  });

  it("maps financial summary null settlement", () => {
    const r = mapFinancialSummary({
      contract_id: "abc", contract_status: "completed", agreed_amount: "500000.00",
      escrow_amount: "0.00", payment_breakdown: { contract_amount: "500000.00" },
      settlement: null,
    });
    expect(r.settlement).toBeNull();
  });

  it("status helpers work", () => {
    expect(isSettlementCompleted("completed")).toBe(true);
    expect(isSettlementCompleted("pending")).toBe(false);
    expect(getSettlementStatusLabel("completed")).toBe("Completed");
    expect(getSettlementStatusLabel("failed")).toBe("Failed");
    expect(getSettlementStatusColor("completed")).toContain("green");
    expect(getSettlementStatusColor("unknown" as any)).toContain("gray");
  });

  it("action helpers", () => {
    expect(canReleaseEscrow("client", "completed")).toBe(true);
    expect(canReleaseEscrow("technician", "completed")).toBe(false);
    expect(canReleaseEscrow("client", "active")).toBe(false);
    expect(canReleaseEscrow("client", "completed", "completed")).toBe(false);
    expect(canViewSettlement("admin", "active")).toBe(true);
    expect(canViewSettlement("client", "completed")).toBe(true);
  });
});

describe("Phase 9 - Wallet domain", () => {
  it("maps wallet info", () => {
    const w = mapWalletInfo({ user_id: "abc", balance: "100000.00" });
    expect(w.balance).toBe("100000.00");
    expect(w.recent_transactions).toEqual([]);
  });

  it("maps available balance", () => {
    const b = mapAvailableBalance({ total_balance: "50000.00", reserved_balance: "10000.00", available_balance: "40000.00" });
    expect(b.total_balance).toBe("50000.00");
    expect(b.available_balance).toBe("40000.00");
  });

  it("transaction type labels", () => {
    expect(getTransactionTypeLabel("release")).toBe("Release");
    expect(getTransactionTypeLabel("platform_fee")).toBe("Platform Fee");
    expect(getTransactionTypeLabel("deposit")).toBe("Deposit");
    expect(getTransactionTypeColor("release")).toContain("teal");
    expect(getTransactionTypeColor("unknown" as any)).toContain("gray");
  });
});

describe("Phase 9 - Withdrawal domain", () => {
  it("maps withdrawal", () => {
    const w = mapWithdrawalRequest({ id: "abc", amount: "10000.00", status: "pending" });
    expect(w.amount).toBe("10000.00");
    expect(w.status).toBe("pending");
  });

  it("maps withdrawal with all fields", () => {
    const w = mapWithdrawalRequest({
      id: "abc", user: "u1", wallet: "w1", amount: "5000.00",
      currency: "IQD", status: "paid", requested_method: "bank",
      notes: "test", admin_note: "ok", failure_code: "",
      failure_message: "", created_at: "2026-01-01", updated_at: "2026-01-01",
    });
    expect(w.currency).toBe("IQD");
    expect(w.status).toBe("paid");
  });

  it("status labels", () => {
    expect(getWithdrawalStatusLabel("pending")).toBe("Pending");
    expect(getWithdrawalStatusLabel("paid")).toBe("Paid");
    expect(getWithdrawalStatusLabel("failed")).toBe("Failed");
    expect(getWithdrawalStatusLabel("canceled")).toBe("Canceled");
  });

  it("status checks", () => {
    expect(isWithdrawalCancelable("pending")).toBe(true);
    expect(isWithdrawalCancelable("approved")).toBe(true);
    expect(isWithdrawalCancelable("paid")).toBe(false);
    expect(isWithdrawalPaid("paid")).toBe(true);
    expect(isWithdrawalPaid("pending")).toBe(false);
    expect(isWithdrawalFailed("failed")).toBe(true);
    expect(isWithdrawalFailed("pending")).toBe(false);
  });

  it("action helpers", () => {
    expect(canCancelWithdrawal("technician", "pending", true)).toBe(true);
    expect(canCancelWithdrawal("technician", "pending", false)).toBe(false);
    expect(canCancelWithdrawal("technician", "paid", true)).toBe(false);
    expect(canStaffApprove("pending")).toBe(true);
    expect(canStaffApprove("approved")).toBe(false);
    expect(canStaffReject("pending")).toBe(true);
    expect(canStaffReject("approved")).toBe(false);
    expect(canStaffProcess("approved")).toBe(true);
    expect(canStaffProcess("pending")).toBe(false);
    expect(canStaffConfirmPayout("processing")).toBe(true);
    expect(canStaffConfirmPayout("approved")).toBe(true);
    expect(canStaffConfirmPayout("paid")).toBe(false);
    expect(canStaffRetryPayout("failed")).toBe(true);
    expect(canStaffRetryPayout("paid")).toBe(false);
  });
});
