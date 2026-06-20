/** Deliverable & Revision API client */

import { backendGet, backendPost } from "@/lib/api/backend-client";
import type {
  DeliverableSubmission,
  DeliverableCreatePayload,
  RevisionRequest,
  RevisionCreatePayload,
} from "../deliverables/types";
import {
  DeliverableSubmissionSchema,
  DeliverableListSchema,
  DeliverableCreateSchema,
  RevisionRequestSchema,
  RevisionCreateSchema,
} from "../deliverables/schemas";

/** Submit a deliverable (technician) */
export async function submitDeliverable(
  milestoneId: string,
  payload: DeliverableCreatePayload,
  accessToken: string,
): Promise<DeliverableSubmission> {
  const body = DeliverableCreateSchema.parse(payload);
  const { data } = await backendPost<DeliverableSubmission>(
    `/api/contracts/milestones/${milestoneId}/submit/`,
    body,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return DeliverableSubmissionSchema.parse(data);
}

/** List submissions for a milestone */
export async function listSubmissions(
  milestoneId: string,
  accessToken: string,
): Promise<DeliverableSubmission[]> {
  const { data } = await backendGet<DeliverableSubmission[]>(
    `/api/contracts/milestones/${milestoneId}/submissions/`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return DeliverableListSchema.parse(data);
}

/** Request revision (client) */
export async function requestRevision(
  milestoneId: string,
  payload: RevisionCreatePayload,
  accessToken: string,
): Promise<RevisionRequest> {
  const body = RevisionCreateSchema.parse(payload);
  const { data } = await backendPost<RevisionRequest>(
    `/api/contracts/milestones/${milestoneId}/revision/`,
    body,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return RevisionRequestSchema.parse(data);
}
