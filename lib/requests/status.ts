/**
 * Request status utilities — normalization, labels, tones, and allowed actions.
 */

import type { RequestStatus } from "./types";

/**
 * Normalize a status string to handle case variations from the backend.
 */
export function normalizeRequestStatus(raw: string): RequestStatus {
  return raw.toUpperCase() as RequestStatus;
}

/**
 * Get the i18n translation key for a request status label.
 */
export function getRequestStatusLabelKey(status: RequestStatus): string {
  const map: Record<RequestStatus, string> = {
    PENDING: "requestStatus.pending",
    ACCEPTED: "requestStatus.accepted",
    DECLINED: "requestStatus.declined",
    CANCELLED: "requestStatus.cancelled",
    WITHDRAWN: "requestStatus.withdrawn",
  };
  return map[status] ?? "requestStatus.unknown";
}

/**
 * Get UI tone/color variant for a request status.
 */
export function getRequestStatusTone(
  status: RequestStatus
): "default" | "warning" | "success" | "danger" | "secondary" {
  const map: Record<RequestStatus, "default" | "warning" | "success" | "danger" | "secondary"> = {
    PENDING: "warning",
    ACCEPTED: "success",
    DECLINED: "danger",
    CANCELLED: "secondary",
    WITHDRAWN: "secondary",
  };
  return map[status] ?? "default";
}

/**
 * Get actions the client can perform on a request.
 */
export function getAllowedClientActions(
  status: RequestStatus
): ("cancel" | "withdraw")[] {
  if (status === "PENDING") return ["cancel", "withdraw"];
  return [];
}

/**
 * Get actions the technician can perform on a request.
 */
export function getAllowedTechnicianActions(
  status: RequestStatus
): ("accept" | "decline")[] {
  if (status === "PENDING") return ["accept", "decline"];
  return [];
}

/**
 * Check if a status is terminal (no further actions possible).
 */
export function isTerminalStatus(status: RequestStatus): boolean {
  return ["ACCEPTED", "DECLINED", "CANCELLED", "WITHDRAWN"].includes(status);
}
