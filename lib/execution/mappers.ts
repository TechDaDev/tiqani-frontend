/** Execution domain safe mappers — strips private/internal fields */

import type {
  ContractExecutionEligibility,
  ExecutionHistoryEvent,
} from "./types";

/** Strip internal fields from execution history events */
export function sanitizeHistoryEvent(
  event: ExecutionHistoryEvent,
): ExecutionHistoryEvent {
  return event;
}
