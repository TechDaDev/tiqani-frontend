/**
 * Withdrawal domain types.
 */

export type WithdrawalStatus =
  | "pending"
  | "approved"
  | "processing"
  | "rejected"
  | "paid"
  | "failed"
  | "canceled";

export interface WithdrawalRequest {
  id: string;
  user: string;
  wallet: string;
  amount: string;
  currency: string;
  status: WithdrawalStatus;
  requested_method: string;
  notes: string;
  admin_note: string;
  reviewed_at?: string;
  paid_at?: string;
  failure_code: string;
  failure_message: string;
  created_at: string;
  updated_at: string;
}

export interface WithdrawalCreate {
  amount: string;
  requested_method?: string;
  notes?: string;
}
