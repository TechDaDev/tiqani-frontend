/** Refund record mappers. */
import type { RefundRecord, Liability } from "./types";

export function mapRefundRecord(raw: Record<string, unknown>): RefundRecord {
  return {
    id: String(raw.id || ""),
    dispute: String(raw.dispute || ""),
    contract: String(raw.contract || ""),
    client: String(raw.client || ""),
    amount: String(raw.amount || "0.00"),
    currency: String(raw.currency || "IQD"),
    source_type: (raw.source_type as RefundRecord["source_type"]) || "escrow",
    source_type_display: String(raw.source_type_display || ""),
    status: (raw.status as RefundRecord["status"]) || "pending",
    status_display: String(raw.status_display || ""),
    refund_method: String(raw.refund_method || ""),
    provider_reference: String(raw.provider_reference || ""),
    wallet_transaction: raw.wallet_transaction ? String(raw.wallet_transaction) : null,
    created_by: String(raw.created_by || ""),
    initiated_at: String(raw.initiated_at || ""),
    completed_at: raw.completed_at ? String(raw.completed_at) : null,
    failed_at: raw.failed_at ? String(raw.failed_at) : null,
    failure_code: String(raw.failure_code || ""),
    failure_message: String(raw.failure_message || ""),
  };
}

export function mapLiability(raw: Record<string, unknown>): Liability {
  return {
    id: String(raw.id || ""),
    user: String(raw.user || ""),
    source_dispute: String(raw.source_dispute || ""),
    original_amount: String(raw.original_amount || "0.00"),
    recovered_amount: String(raw.recovered_amount || "0.00"),
    remaining_amount: String(raw.remaining_amount || "0.00"),
    status: String(raw.status || "open"),
    status_display: String(raw.status_display || ""),
    created_at: String(raw.created_at || ""),
    updated_at: String(raw.updated_at || ""),
  };
}
