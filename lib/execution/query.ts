/** Execution query helpers — refresh/retry logic */

import type { ContractExecutionStatus } from "./types";

/** Whether the UI should refetch after mutation */
export function shouldRefetchAfterAction(
  currentStatus: ContractExecutionStatus,
): boolean {
  return true;
}

/** Delay before refetch (ms) */
export const REFETCH_DELAY = 500;
