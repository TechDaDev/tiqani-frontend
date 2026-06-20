/** Milestone API client */

import { backendGet, backendPost, backendPatch } from "@/lib/api/backend-client";
import type { Milestone, MilestoneCreatePayload, MilestoneUpdatePayload, MilestoneReorderPayload } from "@/lib/milestones/types";
import { MilestoneSchema, MilestoneListSchema, MilestoneCreateSchema, MilestoneReorderSchema } from "@/lib/milestones/schemas";

/** List milestones for a contract (paginated) */
export async function listMilestones(
  contractId: string,
  accessToken: string,
): Promise<{ count: number; results: Milestone[] }> {
  const { data } = await backendGet<{ count: number; results: Milestone[] }>(
    `/api/contracts/${contractId}/milestones/`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return MilestoneListSchema.parse(data);
}

/** Get single milestone */
export async function getMilestone(
  milestoneId: string,
  accessToken: string,
): Promise<Milestone> {
  const { data } = await backendGet<Milestone>(
    `/api/contracts/milestones/${milestoneId}/`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return MilestoneSchema.parse(data);
}

/** Create milestone */
export async function createMilestone(
  contractId: string,
  payload: MilestoneCreatePayload,
  accessToken: string,
): Promise<Milestone> {
  const body = MilestoneCreateSchema.parse(payload);
  const { data } = await backendPost<Milestone>(
    `/api/contracts/${contractId}/milestones/`,
    body,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return MilestoneSchema.parse(data);
}

/** Update milestone (PATCH — draft only) */
export async function updateMilestone(
  milestoneId: string,
  payload: MilestoneUpdatePayload,
  accessToken: string,
): Promise<Milestone> {
  const { data } = await backendPatch<Milestone>(
    `/api/contracts/milestones/${milestoneId}/`,
    payload,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return MilestoneSchema.parse(data);
}

/** Reorder milestones */
export async function reorderMilestones(
  contractId: string,
  payload: MilestoneReorderPayload,
  accessToken: string,
): Promise<Milestone[]> {
  const body = MilestoneReorderSchema.parse(payload);
  const { data } = await backendPost<Milestone[]>(
    `/api/contracts/${contractId}/milestones/reorder/`,
    body,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return data;
}

/** Start milestone (technician) */
export async function startMilestone(
  milestoneId: string,
  accessToken: string,
): Promise<Milestone> {
  const { data } = await backendPost<Milestone>(
    `/api/contracts/milestones/${milestoneId}/start/`,
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return MilestoneSchema.parse(data);
}

/** Approve milestone (client) */
export async function approveMilestone(
  milestoneId: string,
  accessToken: string,
): Promise<Milestone> {
  const { data } = await backendPost<Milestone>(
    `/api/contracts/milestones/${milestoneId}/approve/`,
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return MilestoneSchema.parse(data);
}
