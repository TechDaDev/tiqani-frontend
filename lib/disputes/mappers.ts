/** Safe response mappers. Strips private fields, normalizes unknown values. */
import type {
  Dispute, DisputeStatement, DisputeEvidence, DisputeResolution, DisputeAuditEvent,
  DisputeEligibility, DisputeReconciliation,
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

function mapStatements(raw: unknown): DisputeStatement[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s: Record<string, unknown>) => ({
    id: String(s.id || ""),
    dispute: String(s.dispute || ""),
    submitted_by: String(s.submitted_by || ""),
    submitted_by_name: String(s.submitted_by_name || ""),
    statement: String(s.statement || ""),
    created_at: String(s.created_at || ""),
  }));
}

function mapEvidence(raw: unknown): DisputeEvidence[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((e: Record<string, unknown>) => ({
    id: String(e.id || ""),
    dispute: String(e.dispute || ""),
    submitted_by: String(e.submitted_by || ""),
    submitted_by_name: String(e.submitted_by_name || ""),
    evidence_type: String(e.evidence_type || "other") as DisputeEvidence["evidence_type"],
    description: String(e.description || ""),
    file: e.file ? String(e.file) : null,
    mime_type: String(e.mime_type || ""),
    file_size: Number(e.file_size) || 0,
    created_at: String(e.created_at || ""),
  }));
}

function mapResolution(raw: unknown): DisputeResolution | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  return {
    id: String(r.id || ""),
    dispute: String(r.dispute || ""),
    resolved_by: String(r.resolved_by || ""),
    resolved_by_name: String(r.resolved_by_name || ""),
    resolution_type: String(r.resolution_type || "") as DisputeResolution["resolution_type"],
    resolution_type_display: String(r.resolution_type_display || ""),
    client_refund_amount: String(r.client_refund_amount || "0.00"),
    technician_retained_amount: String(r.technician_retained_amount || "0.00"),
    platform_fee_reversal_amount: String(r.platform_fee_reversal_amount || "0.00"),
    escrow_released_amount: String(r.escrow_released_amount || "0.00"),
    wallet_reversal_amount: String(r.wallet_reversal_amount || "0.00"),
    unrecoverable_amount: String(r.unrecoverable_amount || "0.00"),
    outstanding_liability_amount: String(r.outstanding_liability_amount || "0.00"),
    resolution_reason: String(r.resolution_reason || ""),
    resolved_at: String(r.resolved_at || ""),
  };
}

function mapAuditEvents(raw: unknown): DisputeAuditEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((a: Record<string, unknown>) => ({
    id: String(a.id || ""),
    dispute: String(a.dispute || ""),
    event_type: String(a.event_type || ""),
    actor: a.actor ? String(a.actor) : null,
    actor_name: a.actor_name ? String(a.actor_name) : null,
    payload: (a.payload as Record<string, unknown>) || {},
    created_at: String(a.created_at || ""),
  }));
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
    statements: mapStatements(safe.statements),
    evidence_items: mapEvidence(safe.evidence_items),
    resolution: mapResolution(safe.resolution),
    audit_events: mapAuditEvents(safe.audit_events),
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
