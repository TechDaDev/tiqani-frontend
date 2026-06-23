/** Chargeback response mappers. */
import type { ChargebackEvent } from "./types";

export function mapChargebackEvent(raw: Record<string, unknown>): ChargebackEvent {
  return {
    id: String(raw.id || ""),
    contract: String(raw.contract || ""),
    contract_reference: String(raw.contract_reference || ""),
    dispute: raw.dispute ? String(raw.dispute) : null,
    provider_reference: String(raw.provider_reference || ""),
    amount: String(raw.amount || "0.00"),
    reason_code: String(raw.reason_code || ""),
    received_at: String(raw.received_at || ""),
    evidence_deadline: raw.evidence_deadline ? String(raw.evidence_deadline) : null,
    status: (raw.status as ChargebackEvent["status"]) || "received",
    status_display: String(raw.status_display || ""),
    outcome: String(raw.outcome || ""),
    resolved_by: raw.resolved_by ? String(raw.resolved_by) : null,
    resolved_at: raw.resolved_at ? String(raw.resolved_at) : null,
  };
}
