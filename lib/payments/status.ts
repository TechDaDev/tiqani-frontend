/**
 * Payment status helpers — normalized labels, colors, allowed actions.
 */
import type { FundingStatus } from "./types";

export type PaymentStatusColor =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";

export const fundingStatusConfig: Record<
  FundingStatus,
  { labelKey: string; color: PaymentStatusColor; isTerminal: boolean }
> = {
  unfunded: { labelKey: "paymentStatus.unfunded", color: "default", isTerminal: false },
  pending: { labelKey: "paymentStatus.pending", color: "warning", isTerminal: false },
  funded: { labelKey: "paymentStatus.funded", color: "success", isTerminal: true },
  failed: { labelKey: "paymentStatus.failed", color: "danger", isTerminal: false },
};

export function isFundingTerminal(status: FundingStatus): boolean {
  return fundingStatusConfig[status]?.isTerminal ?? false;
}

export function canStartFunding(status: FundingStatus): boolean {
  return status === "unfunded" || status === "failed";
}

export function getFundingStatusColor(status: FundingStatus): PaymentStatusColor {
  return fundingStatusConfig[status]?.color ?? "default";
}
