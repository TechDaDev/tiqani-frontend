/** Milestone role-based action helpers */

import { MILESTONE_STATUS, type MilestoneStatus } from "./types";

export interface MilestoneActions {
  canEdit: boolean;
  canStart: boolean;
  canSubmit: boolean;
  canRequestRevision: boolean;
  canApprove: boolean;
}

export function getClientMilestoneActions(
  status: MilestoneStatus,
): MilestoneActions {
  return {
    canEdit: status === MILESTONE_STATUS.DRAFT,
    canStart: false,
    canSubmit: false,
    canRequestRevision: status === MILESTONE_STATUS.SUBMITTED,
    canApprove: status === MILESTONE_STATUS.SUBMITTED,
  };
}

export function getTechnicianMilestoneActions(
  status: MilestoneStatus,
): MilestoneActions {
  return {
    canEdit: false,
    canStart: status === MILESTONE_STATUS.PENDING,
    canSubmit: status === MILESTONE_STATUS.IN_PROGRESS || status === MILESTONE_STATUS.REVISION_REQUESTED,
    canRequestRevision: false,
    canApprove: false,
  };
}
