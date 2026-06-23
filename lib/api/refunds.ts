/** Client-side API functions for refunds. */
import { browserClient } from "./browser-client";
import type { RefundRecord } from "@/lib/refunds/types";
import { mapRefundRecord } from "@/lib/refunds/mappers";

export async function fetchRefund(refundId: string): Promise<RefundRecord> {
  const data = await browserClient.get(`/api/refunds/${refundId}/`);
  return mapRefundRecord(data);
}

export async function adminSandboxConfirmRefund(refundId: string): Promise<RefundRecord> {
  const data = await browserClient.post(`/api/admin/refunds/${refundId}/sandbox-confirm/`, {});
  return mapRefundRecord(data);
}

export async function adminRetryRefund(refundId: string): Promise<RefundRecord> {
  const data = await browserClient.post(`/api/admin/refunds/${refundId}/retry/`, {});
  return mapRefundRecord(data);
}
