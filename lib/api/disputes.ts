/** Client-side API functions for disputes. */
import { browserClient } from "./browser-client";
import type {
  Dispute, DisputeEligibility, ActiveDisputeResponse,
  DisputeReconciliation, DisputeCreatePayload,
  StatementCreatePayload, EvidenceCreatePayload,
  AdminAssignPayload, AdminResolvePayload, AdminRejectPayload,
  AdminResolutionProposePayload,
} from "@/lib/disputes/types";
import { mapDispute, mapDisputeEligibility, mapDisputeReconciliation } from "@/lib/disputes/mappers";

export async function fetchDisputes(status?: string): Promise<Dispute[]> {
  const params = status ? `?status=${status}` : "";
  const data = await browserClient.get(`/api/disputes/${params}`);
  return Array.isArray(data) ? data.map(mapDispute) : [];
}

export async function fetchDispute(disputeId: string): Promise<Dispute> {
  const data = await browserClient.get(`/api/disputes/${disputeId}/`);
  return mapDispute(data);
}

export async function createDispute(payload: DisputeCreatePayload): Promise<Dispute> {
  const path = "/api/disputes/create/";
  const data = await browserClient.post(path, payload);
  return mapDispute(data);
}

export async function addStatement(disputeId: string, payload: StatementCreatePayload): Promise<Dispute> {
  const data = await browserClient.post(`/api/disputes/${disputeId}/statements/`, payload);
  return mapDispute(data);
}

export async function addEvidence(disputeId: string, payload: EvidenceCreatePayload): Promise<Dispute> {
  const data = await browserClient.post(`/api/disputes/${disputeId}/evidence/`, payload);
  return mapDispute(data);
}

export async function cancelDispute(disputeId: string): Promise<Dispute> {
  const data = await browserClient.post(`/api/disputes/${disputeId}/cancel/`, {});
  return mapDispute(data);
}

export async function fetchDisputeEligibility(contractId: string): Promise<DisputeEligibility> {
  const data = await browserClient.get(`/api/contracts/${contractId}/dispute-eligibility/`);
  return mapDisputeEligibility(data);
}

export async function fetchActiveDispute(contractId: string): Promise<ActiveDisputeResponse> {
  const data = await browserClient.get(`/api/contracts/${contractId}/active-dispute/`);
  return data as ActiveDisputeResponse;
}

export async function fetchDisputeRefunds(disputeId: string) {
  return browserClient.get(`/api/disputes/${disputeId}/refunds/`);
}

/** Staff endpoints */
export async function fetchAdminDisputes(status?: string, category?: string): Promise<Dispute[]> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (category) params.set("category", category);
  const qs = params.toString();
  const data = await browserClient.get(`/api/admin/disputes/${qs ? `?${qs}` : ""}`);
  return Array.isArray(data) ? data.map(mapDispute) : [];
}

export async function fetchAdminDispute(disputeId: string): Promise<Dispute> {
  const data = await browserClient.get(`/api/admin/disputes/${disputeId}/`);
  return mapDispute(data);
}

export async function assignDispute(disputeId: string, payload: AdminAssignPayload) {
  return browserClient.post(`/api/admin/disputes/${disputeId}/assign/`, payload);
}

export async function startReview(disputeId: string) {
  return browserClient.post(`/api/admin/disputes/${disputeId}/start-review/`, {});
}

export async function startMediation(disputeId: string) {
  return browserClient.post(`/api/admin/disputes/${disputeId}/start-mediation/`, {});
}

export async function proposeResolution(disputeId: string, payload: AdminResolutionProposePayload) {
  return browserClient.post(`/api/admin/disputes/${disputeId}/propose-resolution/`, payload);
}

export async function resolveDispute(disputeId: string, payload: AdminResolvePayload) {
  return browserClient.post(`/api/admin/disputes/${disputeId}/resolve/`, payload);
}

export async function rejectDispute(disputeId: string, payload?: AdminRejectPayload) {
  return browserClient.post(`/api/admin/disputes/${disputeId}/reject/`, (payload || {}));
}

export async function closeDispute(disputeId: string) {
  return browserClient.post(`/api/admin/disputes/${disputeId}/close/`, {});
}

export async function fetchDisputeReconciliation(disputeId: string): Promise<DisputeReconciliation> {
  const data = await browserClient.get(`/api/admin/disputes/${disputeId}/reconciliation/`);
  return mapDisputeReconciliation(data);
}

export async function adminCreateRefund(disputeId: string, payload: { amount: string; source_type: string; idempotency_key?: string }) {
  return browserClient.post(`/api/admin/disputes/${disputeId}/refunds/`, payload);
}
