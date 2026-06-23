/** Safe response mappers. Strips private fields, normalizes unknown values. */
import type {
  Dispute, DisputeEligibility, DisputeReconciliation,
} from "./types";
import { getDisputeStatusLabel, getResolutionLabel } from "./status";

const PRIVATE_FIELDS = [
  "wallet", "wallet_id", "provider_reference",
  "payment_method", "access_token", "refresh_token",
];

function stripPrivate(data: Record<string, unknown>): Record<string, unknown> {
  const result = { ...data };
  for (const field of PRIVATE_FIELDS) {
    delete result[field];
  }
  return result;
}

export function mapDispute(raw: Record<string, unknown>): Dispute {
  const safe = stripPrivate(raw);
  return {
    id: String(safe.id || ""),
    contract: String(safe.contract || ""),
    contract_reference: String(safe.contract_reference || ""),
    opened_by: String(safe.opened_by || ""),
    opened_by_name: String(safe.opened_by_name || ""),
    respondent: String(safe.respondent || ""),
    respondent_name: String(safe.respondent_name || ""),
    reason: (safe.reason as Dispute["reason"]) || "other",
    reason_display: String(safe.reason_display || getDisputeStatusLabel(String(safe.reason || ""))),
    category: (safe.category as Dispute["category"]) || null,
    category_display: String(safe.category_display || "") || null,
    claimed_amount: String(safe.claimed_amount || "0.00"),
    currency: String(safe.currency || "IQD"),
    status: (safe.status as Dispute["status"]) || "open",
    status_display: String(safe.status_display || getDisputeStatusLabel(String(safe.status || ""))),
    assigned_staff: safe.assigned_staff ? String(safe.assigned_staff) : null,
    assigned_staff_name: safe.assigned_staff_name ? String(safe.assigned_staff_name) : null,
    opened_at: String(safe.opened_at || ""),
    response_due_at: safe.response_due_at ? String(safe.response_due_at) : null,
    review_started_at: safe.review_started_at ? String(safe.review_started_at) : null,
    resolved_at: safe.resolved_at ? String(safe.resolved_at) : null,
    closed_at: safe.closed_at ? String(safe.closed_at) : null,
    resolution_summary: String(safe.resolution_summary || ""),
  };
}

export function mapDisputeEligibility(raw: Record<string, unknown>): DisputeEligibility {
  return {
    eligible: Boolean(raw.eligible),
    reason: String(raw.reason || ""),
  };
}

export function mapDisputeReconciliation(raw: Record<string, unknown>): DisputeReconciliation {
  return {
    dispute_id: String(raw.dispute_id || ""),
    contract_id: String(raw.contract_id || ""),
    status: String(raw.status || ""),
    category: raw.category ? String(raw.category) : null,
    resolution_type: raw.resolution_type ? String(raw.resolution_type) : null,
    client_refund_amount: String(raw.client_refund_amount || "0.00"),
    technician_retained: String(raw.technician_retained || "0.00"),
    platform_fee_reversal: String(raw.platform_fee_reversal || "0.00"),
    wallet_reversal: String(raw.wallet_reversal || "0.00"),
    unrecoverable: String(raw.unrecoverable || "0.00"),
    outstanding_liability: String(raw.outstanding_liability || "0.00"),
    refund_count: Number(raw.refund_count) || 0,
    refund_statuses: Array.isArray(raw.refund_statuses) ? raw.refund_statuses.map(String) : [],
    refund_total: String(raw.refund_total || "0.00"),
    liability_count: Number(raw.liability_count) || 0,
    liability_remaining: String(raw.liability_remaining || "0.00"),
  };
}
