/** Execution domain types — mapped from backend ContractExecution models */

/** Contract execution eligibility (from ContractExecutionEligibilitySerializer) */
export interface ContractExecutionEligibility {
  eligible: boolean;
  reason: string;
  contract_status: string;
  funding_status: string;
  milestone_count: number;
  can_activate: boolean;
  can_request_completion: boolean;
  can_confirm_completion: boolean;
}

/** Execution history event (from ExecutionHistorySerializer) */
export interface ExecutionHistoryEvent {
  id: string;
  contract: string;
  event_type: string;
  actor: string | null;
  actor_name: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
}

/** Completion request (from CompletionRequestSerializer) */
export interface CompletionRequest {
  id: string;
  contract: string;
  requested_by: string;
  requested_by_name: string;
  completion_message: string;
  status: string;
  response_message: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Completion request create payload */
export interface CompletionRequestCreatePayload {
  completion_message?: string;
}

/** Completion respond payload */
export interface CompletionRespondPayload {
  confirm: boolean;
  response_message?: string;
}

/** Activation response */
export interface ActivationResponse {
  status: string;
  activated_at: string;
}

/** Confirm completion response */
export interface ConfirmCompletionResponse {
  status: string;
  escrow_held: string;
  total_paid: string;
}

/** Contract execution statuses matching backend Contract.status */
export const CONTRACT_EXECUTION_STATUS = {
  DRAFT: "draft",
  IN_PROGRESS: "in_progress",
  ACTIVE: "active",
  COMPLETION_REQUESTED: "completion_requested",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type ContractExecutionStatus =
  (typeof CONTRACT_EXECUTION_STATUS)[keyof typeof CONTRACT_EXECUTION_STATUS];
