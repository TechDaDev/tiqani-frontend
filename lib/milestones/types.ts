/** Milestone domain types */

import type {
  DeliverableSubmission,
  RevisionRequest,
} from "@/lib/deliverables/types";

/** Milestone statuses matching backend ExecutionMilestone.Status */
export const MILESTONE_STATUS = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  SUBMITTED: "SUBMITTED",
  REVISION_REQUESTED: "REVISION_REQUESTED",
  APPROVED: "APPROVED",
  CANCELLED: "CANCELLED",
} as const;

export type MilestoneStatus =
  (typeof MILESTONE_STATUS)[keyof typeof MILESTONE_STATUS];

/** Milestone list fields (from ExecutionMilestoneListSerializer) */
export interface Milestone {
  id: string;
  contract: string;
  sequence: number;
  title: string;
  description: string;
  due_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  revision_count: number;
}

/** Milestone detail (from ExecutionMilestoneDetailSerializer) — adds nested submissions & revisions */
export interface MilestoneDetail extends Milestone {
  created_by: string | null;
  submissions: DeliverableSubmission[];
  revisions: RevisionRequest[];
}

export interface MilestoneCreatePayload {
  title: string;
  description?: string;
  due_date?: string;
  sequence?: number;
}

export interface MilestoneUpdatePayload {
  title?: string;
  description?: string;
  due_date?: string;
}

export interface MilestoneReorderPayload {
  sequence: string[];
}
