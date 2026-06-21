/**
 * Withdrawal action helpers.
 */
import type { WithdrawalStatus } from "./types";

export function canRequestWithdrawal(role: string): boolean {
  return role === "technician";
}

export function canCancelWithdrawal(
  role: string,
  withdrawalStatus: WithdrawalStatus,
  isOwner: boolean
): boolean {
  if (!isOwner) return false;
  return withdrawalStatus === "pending" || withdrawalStatus === "approved";
}

export function canStaffApprove(status: WithdrawalStatus): boolean {
  return status === "pending";
}

export function canStaffReject(status: WithdrawalStatus): boolean {
  return status === "pending";
}

export function canStaffProcess(status: WithdrawalStatus): boolean {
  return status === "approved";
}

export function canStaffConfirmPayout(status: WithdrawalStatus): boolean {
  return status === "processing" || status === "approved";
}

export function canStaffRetryPayout(status: WithdrawalStatus): boolean {
  return status === "failed";
}
