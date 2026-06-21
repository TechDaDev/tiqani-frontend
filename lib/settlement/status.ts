/**
 * Settlement status helpers.
 */
import type { SettlementStatus } from "./types";

export const SETTLEMENT_STATUS_LABELS: Record<SettlementStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  reversed: "Reversed",
};

export const SETTLEMENT_STATUS_COLORS: Record<SettlementStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  reversed: "bg-gray-100 text-gray-800",
};

export function getSettlementStatusLabel(status: SettlementStatus): string {
  return SETTLEMENT_STATUS_LABELS[status] ?? status;
}

export function getSettlementStatusColor(status: SettlementStatus): string {
  return SETTLEMENT_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-800";
}

export function isSettlementCompleted(status: SettlementStatus): boolean {
  return status === "completed";
}

export function isSettlementFailed(status: SettlementStatus): boolean {
  return status === "failed";
}

export function canSettlementBeRetried(status: SettlementStatus): boolean {
  return status === "failed";
}
