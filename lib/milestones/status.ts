/** Milestone status helpers */

import { MILESTONE_STATUS, type MilestoneStatus } from "./types";

const MILESTONE_LABELS: Record<MilestoneStatus, string> = {
  [MILESTONE_STATUS.DRAFT]: "Draft",
  [MILESTONE_STATUS.PENDING]: "Pending",
  [MILESTONE_STATUS.IN_PROGRESS]: "In Progress",
  [MILESTONE_STATUS.SUBMITTED]: "Submitted",
  [MILESTONE_STATUS.REVISION_REQUESTED]: "Revision Requested",
  [MILESTONE_STATUS.APPROVED]: "Approved",
  [MILESTONE_STATUS.CANCELLED]: "Cancelled",
};

const MILESTONE_COLORS: Record<MilestoneStatus, string> = {
  [MILESTONE_STATUS.DRAFT]: "neutral-soft",
  [MILESTONE_STATUS.PENDING]: "neutral-soft",
  [MILESTONE_STATUS.IN_PROGRESS]: "brand",
  [MILESTONE_STATUS.SUBMITTED]: "warning",
  [MILESTONE_STATUS.REVISION_REQUESTED]: "error",
  [MILESTONE_STATUS.APPROVED]: "success",
  [MILESTONE_STATUS.CANCELLED]: "neutral-soft",
};

export function getMilestoneStatusLabel(status: string): string {
  return MILESTONE_LABELS[status as MilestoneStatus] ?? status;
}

export function getMilestoneStatusColor(status: string): string {
  return MILESTONE_COLORS[status as MilestoneStatus] ?? "neutral-soft";
}

export function isMilestoneTerminal(status: MilestoneStatus): boolean {
  return (
    status === MILESTONE_STATUS.APPROVED ||
    status === MILESTONE_STATUS.CANCELLED
  );
}

export function isMilestoneActionable(status: MilestoneStatus): boolean {
  return !isMilestoneTerminal(status);
}
