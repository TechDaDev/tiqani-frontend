import { describe, it, expect } from "vitest";
import { mapWalletInfo, mapWalletTransaction, mapAvailableBalance } from "@/lib/wallet/mappers";
import { getTransactionTypeLabel } from "@/lib/wallet/status";

describe("Wallet mappers", () => {
  it("maps wallet info", () => {
    const result = mapWalletInfo({
      user_id: "550e8400-e29b-41d4-a716-446655440000",
      balance: "500000.00",
      transaction_id: "abc123",
      updated_at: "2026-06-21T10:00:00Z",
    });
    expect(result.balance).toBe("500000.00");
  });

  it("maps wallet transaction", () => {
    const result = mapWalletTransaction({
      id: "550e8400-e29b-41d4-a716-446655440000",
      wallet: "abc123",
      transaction_type: "release",
      amount: "450000.00",
      description: "Escrow release",
      created_at: "2026-06-21T10:00:00Z",
    });
    expect(result.transaction_type).toBe("release");
    expect(result.amount).toBe("450000.00");
  });

  it("maps available balance", () => {
    const result = mapAvailableBalance({
      total_balance: "500000.00",
      reserved_balance: "100000.00",
      available_balance: "400000.00",
      currency: "IQD",
    });
    expect(result.total_balance).toBe("500000.00");
    expect(result.available_balance).toBe("400000.00");
    expect(result.reserved_balance).toBe("100000.00");
  });
});

describe("Wallet helpers", () => {
  it("getTransactionTypeLabel", () => {
    expect(getTransactionTypeLabel("release")).toBe("Release");
    expect(getTransactionTypeLabel("platform_fee")).toBe("Platform Fee");
    expect(getTransactionTypeLabel("withdrawal")).toBe("Withdrawal");
  });
});
