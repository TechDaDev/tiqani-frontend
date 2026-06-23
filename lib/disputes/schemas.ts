/** Zod schemas for dispute request validation. */
import { z } from "zod";
import { DecimalString, IsoDatetime } from "@/lib/settlement/schemas";

const disputeReasonEnum = z.enum([
  "work_not_delivered", "work_incomplete", "quality_not_as_agreed",
  "misrepresentation", "unauthorized_completion", "client_non_cooperation",
  "scope_change", "payment_or_settlement_error", "fraud_suspected",
  "duplicate_payment", "chargeback_received", "other",
]);

const disputeStatusEnum = z.enum([
  "open", "awaiting_response", "under_review", "mediation",
  "resolution_proposed", "resolved", "closed", "canceled", "rejected",
]);

const resolutionTypeEnum = z.enum([
  "full_client_refund", "partial_client_refund", "full_technician_award",
  "partial_technician_award", "split_resolution", "no_financial_change",
  "dispute_rejected", "manual_recovery_required", "chargeback_upheld",
  "chargeback_rejected",
]);

const evidenceTypeEnum = z.enum([
  "document", "image", "message_reference",
  "deliverable_reference", "milestone_reference", "other",
]);

export const DisputeCreateSchema = z.object({
  contract_id: z.string().uuid(),
  reason: disputeReasonEnum,
  statement: z.string().min(20, "Statement must be at least 20 characters").max(5000),
  claimed_amount: DecimalString,
  idempotency_key: z.string().max(64).optional().nullable(),
});

export const StatementCreateSchema = z.object({
  statement: z.string().min(10).max(5000),
});

export const EvidenceCreateSchema = z.object({
  evidence_type: evidenceTypeEnum,
  description: z.string().max(2000).optional().default(""),
  mime_type: z.string().max(100).optional().default(""),
  file_size: z.number().int().min(0).optional().default(0),
  integrity_hash: z.string().max(64).optional().default(""),
});

export const AdminAssignSchema = z.object({
  staff_id: z.string().uuid(),
});

export const AdminResolveSchema = z.object({
  resolution_type: resolutionTypeEnum,
  client_refund_amount: DecimalString.optional().default("0.00"),
  technician_retained_amount: DecimalString.optional().default("0.00"),
  platform_fee_reversal_amount: DecimalString.optional().default("0.00"),
  escrow_released_amount: DecimalString.optional().default("0.00"),
  wallet_reversal_amount: DecimalString.optional().default("0.00"),
  unrecoverable_amount: DecimalString.optional().default("0.00"),
  outstanding_liability_amount: DecimalString.optional().default("0.00"),
  resolution_reason: z.string().min(1).max(5000),
  idempotency_key: z.string().max(64).optional().nullable(),
});

export const AdminRejectSchema = z.object({
  reason: z.string().max(5000).optional().default(""),
});

export const AdminResolutionProposeSchema = z.object({
  resolution_type: resolutionTypeEnum,
  client_refund_amount: DecimalString.optional().default("0.00"),
  resolution_reason: z.string().max(5000).optional().default(""),
});

export const DisputeEligibilitySchema = z.object({
  eligible: z.boolean(),
  reason: z.string(),
});

export const ActiveDisputeSchema = z.object({
  active: z.boolean(),
  dispute: z.unknown().nullable(),
});

export const DisputeListItemSchema = z.object({
  id: z.string().uuid(),
  contract: z.string().uuid(),
  contract_reference: z.string(),
  opened_by: z.string().uuid(),
  opened_by_name: z.string(),
  respondent: z.string().uuid(),
  respondent_name: z.string(),
  reason: disputeReasonEnum,
  reason_display: z.string(),
  category: z.string().nullable().optional(),
  category_display: z.string().nullable().optional(),
  claimed_amount: DecimalString,
  currency: z.string(),
  status: disputeStatusEnum,
  status_display: z.string(),
  assigned_staff: z.string().uuid().nullable().optional(),
  assigned_staff_name: z.string().nullable().optional(),
  opened_at: IsoDatetime,
  response_due_at: IsoDatetime.nullable().optional(),
  review_started_at: IsoDatetime.nullable().optional(),
  resolved_at: IsoDatetime.nullable().optional(),
  closed_at: IsoDatetime.nullable().optional(),
  resolution_summary: z.string().optional().default(""),
});

export const DisputeListSchema = z.array(DisputeListItemSchema);

export const AdminChargebackSandboxCreateSchema = z.object({
  contract_id: z.string().uuid(),
  amount: DecimalString,
  reason_code: z.string().max(50).optional().default(""),
  idempotency_key: z.string().max(64).optional().nullable(),
});

export const AdminRefundCreateSchema = z.object({
  amount: DecimalString,
  source_type: z.enum([
    "escrow", "technician_wallet_reversal", "platform_fee_reversal",
    "split_sources", "manual_recovery", "sandbox_provider",
  ]),
  idempotency_key: z.string().max(64).optional().nullable(),
});
