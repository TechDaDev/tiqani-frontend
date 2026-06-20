/** Execution status helpers */

import { CONTRACT_EXECUTION_STATUS, type ContractExecutionStatus } from "./types";

const EXECUTION_LABELS: Record<ContractExecutionStatus, string> = {
  [CONTRACT_EXECUTION_STATUS.DRAFT]: "Draft",
  [CONTRACT_EXECUTION_STATUS.IN_PROGRESS]: "In Progress",
  [CONTRACT_EXECUTION_STATUS.ACTIVE]: "Active",
  [CONTRACT_EXECUTION_STATUS.COMPLETION_REQUESTED]: "Completion Requested",
  [CONTRACT_EXECUTION_STATUS.COMPLETED]: "Completed",
  [CONTRACT_EXECUTION_STATUS.CANCELLED]: "Cancelled",
};

const EXECUTION_COLORS: Record<ContractExecutionStatus, string> = {
  [CONTRACT_EXECUTION_STATUS.DRAFT]: "neutral-soft",
  [CONTRACT_EXECUTION_STATUS.IN_PROGRESS]: "brand",
  [CONTRACT_EXECUTION_STATUS.ACTIVE]: "success",
  [CONTRACT_EXECUTION_STATUS.COMPLETION_REQUESTED]: "warning",
  [CONTRACT_EXECUTION_STATUS.COMPLETED]: "success",
  [CONTRACT_EXECUTION_STATUS.CANCELLED]: "error",
};

export function getExecutionStatusLabel(status: string): string {
  return EXECUTION_LABELS[status as ContractExecutionStatus] ?? status;
}

export function getExecutionStatusColor(status: string): string {
  return EXECUTION_COLORS[status as ContractExecutionStatus] ?? "neutral-soft";
}

export function canActivate(status: string, milestoneCount: number): boolean {
  return status === CONTRACT_EXECUTION_STATUS.IN_PROGRESS && milestoneCount > 0;
}
