import { describe, it, expect } from "vitest";
import { mapWithdrawalRequest, mapWithdrawalList } from "@/lib/withdrawals/mappers";
import { getWithdrawalStatusLabel, isWithdrawalCancelable } from "@/lib/withdrawals/status";
import { canCancelWithdrawal, canStaffApprove } from "@/lib/withdrawals/actions";
import type { WithdrawalStatus } from "@/lib/withdrawals/types";

describe("Withdrawal mappers", () => {
  it("maps withdrawal request", () => {
    const result = mapWithdrawalRequest({
      id: "550e8400-e29b-41d4-a716-446655440000",
      user: "660e8400-e29b-41d4-a716-446655440000",
      wallet: "abc123",
      amount: "100000.00",
      currency: "IQD",
      status: "pending",
      requested_method: "",
      notes: "Test withdrawal",
      admin_note: "",
      created_at: "2026-06-21T10:00:00Z",
      updated_at: "2026-06-21T10:00:00Z",
    });
    expect(result.amount).toBe("100000.00");
    expect(result.status).toBe("pending");
    expect(result.notes).toBe("Test withdrawal");
  });

  it("maps withdrawal list", () => {
    const result = mapWithdrawalList([
      { id: "1", status: "pending", amount: "1000.00" } as unknown as Record<string, unknown>,
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe("1000.00");
  });
});

describe("Withdrawal helpers", () => {
  it("status labels", () => {
    expect(getWithdrawalStatusLabel("pending" as WithdrawalStatus)).toBe("Pending");
    expect(getWithdrawalStatusLabel("paid" as WithdrawalStatus)).toBe("Paid");
    expect(getWithdrawalStatusLabel("failed" as WithdrawalStatus)).toBe("Failed");
  });

  it("isWithdrawalCancelable", () => {
    expect(isWithdrawalCancelable("pending" as WithdrawalStatus)).toBe(true);
    expect(isWithdrawalCancelable("approved" as WithdrawalStatus)).toBe(true);
    expect(isWithdrawalCancelable("paid" as WithdrawalStatus)).toBe(false);
  });

  it("canCancelWithdrawal", () => {
    expect(canCancelWithdrawal("technician", "pending" as WithdrawalStatus, true)).toBe(true);
    expect(canCancelWithdrawal("technician", "pending" as WithdrawalStatus, false)).toBe(false);
    expect(canCancelWithdrawal("technician", "paid" as WithdrawalStatus, true)).toBe(false);
  });

  it("canStaffApprove", () => {
    expect(canStaffApprove("pending" as WithdrawalStatus)).toBe(true);
    expect(canStaffApprove("approved" as WithdrawalStatus)).toBe(false);
  });
});
