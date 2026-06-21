/**
 * Withdrawal response mappers.
 */
import type { WithdrawalRequest } from "./types";

export function mapWithdrawalRequest(data: Record<string, unknown>): WithdrawalRequest {
  return {
    id: String(data.id ?? ""),
    user: String(data.user ?? ""),
    wallet: String(data.wallet ?? ""),
    amount: String(data.amount ?? "0.00"),
    currency: String(data.currency ?? "IQD"),
    status: (data.status as WithdrawalRequest["status"]) ?? "pending",
    requested_method: String(data.requested_method ?? ""),
    notes: String(data.notes ?? ""),
    admin_note: String(data.admin_note ?? ""),
    reviewed_at: data.reviewed_at ? String(data.reviewed_at) : undefined,
    paid_at: data.paid_at ? String(data.paid_at) : undefined,
    failure_code: String(data.failure_code ?? ""),
    failure_message: String(data.failure_message ?? ""),
    created_at: String(data.created_at ?? ""),
    updated_at: String(data.updated_at ?? ""),
  };
}

export function mapWithdrawalList(data: Record<string, unknown>[]): WithdrawalRequest[] {
  return data.map(mapWithdrawalRequest);
}
