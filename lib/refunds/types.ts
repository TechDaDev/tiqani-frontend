/** Refund domain types. */

export type RefundSourceType =
  | "escrow"
  | "technician_wallet_reversal"
  | "platform_fee_reversal"
  | "split_sources"
  | "manual_recovery"
  | "sandbox_provider";

export type RefundStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "canceled"
  | "partially_completed";

export interface RefundRecord {
  id: string;
  dispute: string;
  contract: string;
  client: string;
  amount: string;
  currency: string;
  source_type: RefundSourceType;
  source_type_display: string;
  status: RefundStatus;
  status_display: string;
  refund_method: string;
  provider_reference: string;
  wallet_transaction: string | null;
  created_by: string;
  initiated_at: string;
  completed_at: string | null;
  failed_at: string | null;
  failure_code: string;
  failure_message: string;
}

export interface Liability {
  id: string;
  user: string;
  source_dispute: string;
  original_amount: string;
  recovered_amount: string;
  remaining_amount: string;
  status: string;
  status_display: string;
  created_at: string;
  updated_at: string;
}
