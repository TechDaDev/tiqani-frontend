/** Chargeback action predicates. */
import type { ChargebackStatus } from "./types";

export function canStartChargebackReview(status: ChargebackStatus | string): boolean {
  return status === "received";
}

export function canSubmitChargebackEvidence(status: ChargebackStatus | string): boolean {
  return status === "under_review";
}

export function canResolveChargeback(status: ChargebackStatus | string): boolean {
  return ["received", "under_review", "evidence_submitted"].includes(status);
}
