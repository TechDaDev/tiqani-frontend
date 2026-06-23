/** Status display helpers for dispute states. */
import type { DisputeStatus, ResolutionType } from "./types";

const STATUS_LABELS: Record<DisputeStatus, string> = {
  open: "Open",
  awaiting_response: "Awaiting Response",
  under_review: "Under Review",
  mediation: "Mediation",
  resolution_proposed: "Resolution Proposed",
  resolved: "Resolved",
  closed: "Closed",
  canceled: "Canceled",
  rejected: "Rejected",
};

const STATUS_COLORS: Record<DisputeStatus, string> = {
  open: "bg-yellow-100 text-yellow-800",
  awaiting_response: "bg-orange-100 text-orange-800",
  under_review: "bg-blue-100 text-blue-800",
  mediation: "bg-purple-100 text-purple-800",
  resolution_proposed: "bg-indigo-100 text-indigo-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
  canceled: "bg-gray-100 text-gray-800",
  rejected: "bg-red-100 text-red-800",
};

export function getDisputeStatusLabel(status: DisputeStatus | string): string {
  return STATUS_LABELS[status as DisputeStatus] || status;
}

export function getDisputeStatusColor(status: DisputeStatus | string): string {
  return STATUS_COLORS[status as DisputeStatus] || "bg-gray-100 text-gray-800";
}

export function isDisputeActive(status: DisputeStatus | string): boolean {
  const active = ["open", "awaiting_response", "under_review", "mediation", "resolution_proposed"];
  return active.includes(status);
}

export function isDisputeResolved(status: DisputeStatus | string): boolean {
  return ["resolved", "closed", "rejected"].includes(status);
}

export function isDisputeCancelable(status: DisputeStatus | string): boolean {
  return ["open", "awaiting_response"].includes(status);
}

export function isResolutionRefund(resolutionType: ResolutionType | string): boolean {
  return [
    "full_client_refund",
    "partial_client_refund",
    "split_resolution",
    "chargeback_upheld",
  ].includes(resolutionType);
}

const RESOLUTION_LABELS: Record<ResolutionType, string> = {
  full_client_refund: "Full Client Refund",
  partial_client_refund: "Partial Client Refund",
  full_technician_award: "Full Technician Award",
  partial_technician_award: "Partial Technician Award",
  split_resolution: "Split Resolution",
  no_financial_change: "No Financial Change",
  dispute_rejected: "Dispute Rejected",
  manual_recovery_required: "Manual Recovery Required",
  chargeback_upheld: "Chargeback Upheld",
  chargeback_rejected: "Chargeback Rejected",
};

export function getResolutionLabel(type: ResolutionType | string): string {
  return RESOLUTION_LABELS[type as ResolutionType] || type;
}
