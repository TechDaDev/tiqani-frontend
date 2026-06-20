/** Role-based action helpers for execution */

import type { ContractExecutionStatus } from "./types";
import { CONTRACT_EXECUTION_STATUS } from "./types";

export interface ExecutionActions {
  canViewHistory: boolean;
  canCreateMilestone: boolean;
  canReorderMilestones: boolean;
  canActivate: boolean;
  canStartMilestone: boolean;
  canSubmitDeliverable: boolean;
  canRequestRevision: boolean;
  canApproveMilestone: boolean;
  canRequestCompletion: boolean;
  canConfirmCompletion: boolean;
  canRejectCompletion: boolean;
}

export function getClientActions(
  status: ContractExecutionStatus,
  milestoneCount: number,
): ExecutionActions {
  const isActiveOrProgress =
    status === CONTRACT_EXECUTION_STATUS.ACTIVE ||
    status === CONTRACT_EXECUTION_STATUS.IN_PROGRESS;
  return {
    canViewHistory: true,
    canCreateMilestone: isActiveOrProgress,
    canReorderMilestones: isActiveOrProgress,
    canActivate: status === CONTRACT_EXECUTION_STATUS.IN_PROGRESS && milestoneCount > 0,
    canStartMilestone: false,
    canSubmitDeliverable: false,
    canRequestRevision: status === CONTRACT_EXECUTION_STATUS.ACTIVE,
    canApproveMilestone: status === CONTRACT_EXECUTION_STATUS.ACTIVE,
    canRequestCompletion: false,
    canConfirmCompletion: status === CONTRACT_EXECUTION_STATUS.COMPLETION_REQUESTED,
    canRejectCompletion: status === CONTRACT_EXECUTION_STATUS.COMPLETION_REQUESTED,
  };
}

export function getTechnicianActions(
  status: ContractExecutionStatus,
): ExecutionActions {
  return {
    canViewHistory: true,
    canCreateMilestone: false,
    canReorderMilestones: false,
    canActivate: false,
    canStartMilestone: status === CONTRACT_EXECUTION_STATUS.ACTIVE,
    canSubmitDeliverable: status === CONTRACT_EXECUTION_STATUS.ACTIVE,
    canRequestRevision: false,
    canApproveMilestone: false,
    canRequestCompletion: status === CONTRACT_EXECUTION_STATUS.ACTIVE,
    canConfirmCompletion: false,
    canRejectCompletion: false,
  };
}
