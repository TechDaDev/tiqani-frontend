/** Refund action predicates. */
export function canRetryRefund(status: string): boolean {
  return status === "failed";
}

export function canSandboxConfirmRefund(status: string, isStaff: boolean): boolean {
  return isStaff && ["pending", "processing"].includes(status);
}
