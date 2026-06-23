/** Dispute domain types. Mirrors backend dispute/models.py enums and models. */

export type DisputeReason =
  | "work_not_delivered"
  | "work_incomplete"
  | "quality_not_as_agreed"
  | "misrepresentation"
  | "unauthorized_completion"
  | "client_non_cooperation"
  | "scope_change"
  | "payment_or_settlement_error"
  | "fraud_suspected"
  | "duplicate_payment"
  | "chargeback_received"
  | "other";

export type DisputeCategory =
  | "pre_settlement"
  | "post_settlement_recoverable"
  | "post_settlement_partially_recoverable"
  | "post_settlement_non_recoverable"
  | "chargeback_review";

export type DisputeStatus =
  | "open"
  | "awaiting_response"
  | "under_review"
  | "mediation"
  | "resolution_proposed"
  | "resolved"
  | "closed"
  | "canceled"
  | "rejected";

export type ResolutionType =
  | "full_client_refund"
  | "partial_client_refund"
  | "full_technician_award"
  | "partial_technician_award"
  | "split_resolution"
  | "no_financial_change"
  | "dispute_rejected"
  | "manual_recovery_required"
  | "chargeback_upheld"
  | "chargeback_rejected";

export type EvidenceType =
  | "document"
  | "image"
  | "message_reference"
  | "deliverable_reference"
  | "milestone_reference"
  | "other";

export interface DisputeStatement {
  id: string;
  dispute: string;
  submitted_by: string;
  submitted_by_name: string;
  statement: string;
  created_at: string;
}

export interface DisputeEvidence {
  id: string;
  dispute: string;
  submitted_by: string;
  submitted_by_name: string;
  evidence_type: EvidenceType;
  description: string;
  file: string | null;
  mime_type: string;
  file_size: number;
  created_at: string;
}

export interface DisputeAuditEvent {
  id: string;
  dispute: string;
  event_type: string;
  actor: string | null;
  actor_name: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface DisputeResolution {
  id: string;
  dispute: string;
  resolved_by: string;
  resolved_by_name: string;
  resolution_type: ResolutionType;
  resolution_type_display: string;
  client_refund_amount: string;
  technician_retained_amount: string;
  platform_fee_reversal_amount: string;
  escrow_released_amount: string;
  wallet_reversal_amount: string;
  unrecoverable_amount: string;
  outstanding_liability_amount: string;
  resolution_reason: string;
  resolved_at: string;
}

export interface Dispute {
  id: string;
  contract: string;
  contract_reference: string;
  opened_by: string;
  opened_by_name: string;
  respondent: string;
  respondent_name: string;
  reason: DisputeReason;
  reason_display: string;
  category: DisputeCategory | null;
  category_display: string | null;
  claimed_amount: string;
  currency: string;
  status: DisputeStatus;
  status_display: string;
  assigned_staff: string | null;
  assigned_staff_name: string | null;
  opened_at: string;
  response_due_at: string | null;
  review_started_at: string | null;
  resolved_at: string | null;
  closed_at: string | null;
  resolution_summary: string;
  /** Detail-only fields */
  statements?: DisputeStatement[];
  evidence_items?: DisputeEvidence[];
  resolution?: DisputeResolution | null;
  audit_events?: DisputeAuditEvent[];
}

export interface DisputeEligibility {
  eligible: boolean;
  reason: string;
}

export interface ActiveDisputeResponse {
  active: boolean;
  dispute: Dispute | null;
}

export interface DisputeReconciliation {
  dispute_id: string;
  contract_id: string;
  status: string;
  category: string | null;
  resolution_type: string | null;
  client_refund_amount: string;
  technician_retained: string;
  platform_fee_reversal: string;
  wallet_reversal: string;
  unrecoverable: string;
  outstanding_liability: string;
  refund_count: number;
  refund_statuses: string[];
  refund_total: string;
  liability_count: number;
  liability_remaining: string;
}

export interface DisputeCreatePayload {
  contract_id: string;
  reason: DisputeReason;
  statement: string;
  claimed_amount: string;
  idempotency_key?: string;
}

export interface StatementCreatePayload {
  statement: string;
}

export interface EvidenceCreatePayload {
  evidence_type: EvidenceType;
  description?: string;
  mime_type?: string;
  file_size?: number;
  integrity_hash?: string;
}

export interface AdminAssignPayload {
  staff_id: string;
}

export interface AdminResolvePayload {
  resolution_type: ResolutionType;
  client_refund_amount?: string;
  technician_retained_amount?: string;
  platform_fee_reversal_amount?: string;
  escrow_released_amount?: string;
  wallet_reversal_amount?: string;
  unrecoverable_amount?: string;
  outstanding_liability_amount?: string;
  resolution_reason: string;
  idempotency_key?: string;
}

export interface AdminRejectPayload {
  reason?: string;
}

export interface AdminResolutionProposePayload {
  resolution_type: ResolutionType;
  client_refund_amount?: string;
  resolution_reason?: string;
}
