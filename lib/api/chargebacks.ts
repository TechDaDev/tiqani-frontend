/** Client-side API functions for chargebacks. */
import { browserClient } from "./browser-client";
import type { ChargebackEvent, ChargebackCreatePayload, ChargebackPartialPayload } from "@/lib/chargebacks/types";
import { mapChargebackEvent } from "@/lib/chargebacks/mappers";

export async function fetchAdminChargebacks(status?: string): Promise<ChargebackEvent[]> {
  const params = status ? `?status=${status}` : "";
  const data = await browserClient.get(`/api/admin/chargebacks/${params}`);
  return Array.isArray(data) ? data.map(mapChargebackEvent) : [];
}

export async function fetchAdminChargeback(chargebackId: string): Promise<ChargebackEvent> {
  const data = await browserClient.get(`/api/admin/chargebacks/${chargebackId}/`);
  return mapChargebackEvent(data);
}

export async function createSandboxChargeback(payload: ChargebackCreatePayload): Promise<ChargebackEvent> {
  const data = await browserClient.post("/api/admin/chargebacks/sandbox-create/", payload);
  return mapChargebackEvent(data);
}

export async function startChargebackReview(chargebackId: string): Promise<ChargebackEvent> {
  const data = await browserClient.post(`/api/admin/chargebacks/${chargebackId}/start-review/`, {});
  return mapChargebackEvent(data);
}

export async function submitChargebackEvidence(chargebackId: string): Promise<ChargebackEvent> {
  const data = await browserClient.post(`/api/admin/chargebacks/${chargebackId}/submit-evidence/`, {});
  return mapChargebackEvent(data);
}

export async function sandboxUpholdChargeback(chargebackId: string, idempotencyKey?: string): Promise<ChargebackEvent> {
  const data = await browserClient.post(
    `/api/admin/chargebacks/${chargebackId}/sandbox-uphold/`,
    { idempotency_key: idempotencyKey },
  );
  return mapChargebackEvent(data);
}

export async function sandboxRejectChargeback(chargebackId: string, idempotencyKey?: string): Promise<ChargebackEvent> {
  const data = await browserClient.post(
    `/api/admin/chargebacks/${chargebackId}/sandbox-reject/`,
    { idempotency_key: idempotencyKey },
  );
  return mapChargebackEvent(data);
}

export async function sandboxPartialChargeback(chargebackId: string, payload: ChargebackPartialPayload): Promise<ChargebackEvent> {
  const data = await browserClient.post(
    `/api/admin/chargebacks/${chargebackId}/sandbox-partial/`,
    payload,
  );
  return mapChargebackEvent(data);
}
