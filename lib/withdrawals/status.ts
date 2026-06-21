/**
 * Withdrawal status helpers.
 */
import type { WithdrawalStatus } from "./types";

export const WITHDRAWAL_STATUS_LABELS: Record<WithdrawalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  processing: "Processing",
  rejected: "Rejected",
  paid: "Paid",
  failed: "Failed",
  canceled: "Canceled",
};

export const WITHDRAWAL_STATUS_COLORS: Record<WithdrawalStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  rejected: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  canceled: "bg-gray-100 text-gray-800",
};

export function getWithdrawalStatusLabel(status: WithdrawalStatus): string {
  return WITHDRAWAL_STATUS_LABELS[status] ?? status;
}

export function getWithdrawalStatusColor(status: WithdrawalStatus): string {
  return WITHDRAWAL_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-800";
}

export function isWithdrawalPending(status: WithdrawalStatus): boolean {
  return status === "pending";
}

export function isWithdrawalPaid(status: WithdrawalStatus): boolean {
  return status === "paid";
}

export function isWithdrawalFailed(status: WithdrawalStatus): boolean {
  return status === "failed";
}

export function isWithdrawalCancelable(status: WithdrawalStatus): boolean {
  return status === "pending" || status === "approved";
}
