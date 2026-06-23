/** Refund status display helpers. */
import type { RefundStatus, RefundSourceType } from "./types";

const STATUS_LABELS: Record<RefundStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  canceled: "Canceled",
  partially_completed: "Partially Completed",
};

const STATUS_COLORS: Record<RefundStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  canceled: "bg-gray-100 text-gray-800",
  partially_completed: "bg-orange-100 text-orange-800",
};

export function getRefundStatusLabel(status: RefundStatus | string): string {
  return STATUS_LABELS[status as RefundStatus] || status;
}

export function getRefundStatusColor(status: RefundStatus | string): string {
  return STATUS_COLORS[status as RefundStatus] || "bg-gray-100 text-gray-800";
}

const SOURCE_LABELS: Record<RefundSourceType, string> = {
  escrow: "From Escrow",
  technician_wallet_reversal: "Technician Wallet Reversal",
  platform_fee_reversal: "Platform Fee Reversal",
  split_sources: "Split Sources",
  manual_recovery: "Manual Recovery",
  sandbox_provider: "Sandbox Provider",
};

export function getRefundSourceLabel(type: RefundSourceType | string): string {
  return SOURCE_LABELS[type as RefundSourceType] || type;
}

const LIABILITY_STATUS_LABELS: Record<string, string> = {
  open: "Open",
  partially_recovered: "Partially Recovered",
  fully_recovered: "Fully Recovered",
  written_off: "Written Off",
};

export function getLiabilityStatusLabel(status: string): string {
  return LIABILITY_STATUS_LABELS[status] || status;
}
