/**
 * Payment domain tests — types, status, money formatting.
 */
import { describe, it, expect } from "vitest";
import { formatIQD, parseAmount, isPositiveAmount } from "@/lib/payments/money";
import { fundingStatusConfig, canStartFunding, isFundingTerminal, getFundingStatusColor } from "@/lib/payments/status";
import type { FundingStatus } from "@/lib/payments/types";

describe("Money utilities", () => {
  it("formatIQD formats large amounts", () => {
    expect(formatIQD("525000.00")).toContain("IQD");
    expect(formatIQD("525000.00")).toContain("525");
  });

  it("formatIQD handles zero", () => {
    expect(formatIQD("0")).toContain("0");
  });

  it("formatIQD handles string numbers", () => {
    const result = formatIQD("1000000");
    expect(result).toContain("IQD");
  });

  it("parseAmount handles valid string", () => {
    expect(parseAmount("500000.00")).toBe(500000);
  });

  it("parseAmount handles invalid input", () => {
    expect(parseAmount("abc")).toBe(0);
  });

  it("parseAmount handles empty string", () => {
    expect(parseAmount("")).toBe(0);
  });

  it("isPositiveAmount returns true for positive", () => {
    expect(isPositiveAmount("100")).toBe(true);
  });

  it("isPositiveAmount returns false for zero", () => {
    expect(isPositiveAmount("0")).toBe(false);
  });
});

describe("Funding status config", () => {
  it("has all four funding statuses", () => {
    const statuses: FundingStatus[] = ["unfunded", "pending", "funded", "failed"];
    statuses.forEach((s) => {
      expect(fundingStatusConfig[s]).toBeDefined();
    });
  });

  it("funded is terminal", () => {
    expect(isFundingTerminal("funded")).toBe(true);
    expect(isFundingTerminal("unfunded")).toBe(false);
    expect(isFundingTerminal("pending")).toBe(false);
    expect(isFundingTerminal("failed")).toBe(false);
  });

  it("canStartFunding allows unfunded and failed", () => {
    expect(canStartFunding("unfunded")).toBe(true);
    expect(canStartFunding("failed")).toBe(true);
    expect(canStartFunding("pending")).toBe(false);
    expect(canStartFunding("funded")).toBe(false);
  });

  it("getFundingStatusColor returns correct colors", () => {
    expect(getFundingStatusColor("unfunded")).toBe("default");
    expect(getFundingStatusColor("pending")).toBe("warning");
    expect(getFundingStatusColor("funded")).toBe("success");
    expect(getFundingStatusColor("failed")).toBe("danger");
  });
});

describe("FundingStatus type safety", () => {
  it("rejects invalid status", () => {
    const invalid = "invalid" as FundingStatus;
    expect(fundingStatusConfig[invalid]).toBeUndefined();
    expect(canStartFunding(invalid)).toBe(false);
  });
});
