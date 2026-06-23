/** Chargeback domain types. */

export type ChargebackStatus =
  | "received"
  | "under_review"
  | "evidence_submitted"
  | "upheld"
  | "rejected"
  | "partially_upheld"
  | "closed";

export interface ChargebackEvent {
  id: string;
  contract: string;
  contract_reference: string;
  dispute: string | null;
  provider_reference: string;
  amount: string;
  reason_code: string;
  received_at: string;
  evidence_deadline: string | null;
  status: ChargebackStatus;
  status_display: string;
  outcome: string;
  resolved_by: string | null;
  resolved_at: string | null;
}

export interface ChargebackCreatePayload {
  contract_id: string;
  amount: string;
  reason_code?: string;
  idempotency_key?: string;
}

export interface ChargebackPartialPayload {
  partial_amount: string;
  idempotency_key?: string;
}
