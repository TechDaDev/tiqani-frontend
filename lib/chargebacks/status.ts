/** Chargeback status display helpers. */
import type { ChargebackStatus } from "./types";

const STATUS_LABELS: Record<ChargebackStatus, string> = {
  received: "Received",
  under_review: "Under Review",
  evidence_submitted: "Evidence Submitted",
  upheld: "Upheld",
  rejected: "Rejected",
  partially_upheld: "Partially Upheld",
  closed: "Closed",
};

const STATUS_COLORS: Record<ChargebackStatus, string> = {
  received: "bg-yellow-100 text-yellow-800",
  under_review: "bg-blue-100 text-blue-800",
  evidence_submitted: "bg-indigo-100 text-indigo-800",
  upheld: "bg-red-100 text-red-800",
  rejected: "bg-green-100 text-green-800",
  partially_upheld: "bg-orange-100 text-orange-800",
  closed: "bg-gray-100 text-gray-800",
};

export function getChargebackStatusLabel(status: ChargebackStatus | string): string {
  return STATUS_LABELS[status as ChargebackStatus] || status;
}

export function getChargebackStatusColor(status: ChargebackStatus | string): string {
  return STATUS_COLORS[status as ChargebackStatus] || "bg-gray-100 text-gray-800";
}
