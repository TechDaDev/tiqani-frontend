/** Execution domain API client */

import { backendGet, backendPost } from "@/lib/api/backend-client";
import type {
  ContractExecutionEligibility,
  ExecutionHistoryEvent,
} from "@/lib/execution/types";
import {
  ContractExecutionEligibilitySchema,
  ExecutionHistoryListSchema,
  ActivationResponseSchema,
  CompletionResponseSchema,
  CompletionRequestResponseSchema,
} from "@/lib/execution/schemas";

/** Get contract execution eligibility */
export async function getExecutionEligibility(
  contractId: string,
  accessToken: string,
): Promise<ContractExecutionEligibility> {
  const { data } = await backendGet<ContractExecutionEligibility>(
    `/api/contracts/${contractId}/execution/eligibility/`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return ContractExecutionEligibilitySchema.parse(data);
}

/** Activate contract execution */
export async function activateContract(
  contractId: string,
  accessToken: string,
): Promise<{ status: string; activated_at: string }> {
  const { data } = await backendPost<{ status: string; activated_at: string }>(
    `/api/contracts/${contractId}/activate/`,
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return ActivationResponseSchema.parse(data);
}

/** Request contract completion (technician) */
export async function requestCompletion(
  contractId: string,
  message: string,
  accessToken: string,
): Promise<{ status: string }> {
  const { data } = await backendPost<{ status: string }>(
    `/api/contracts/${contractId}/completion-request/`,
    { completion_message: message },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return CompletionRequestResponseSchema.parse(data);
}

/** Confirm contract completion (client) */
export async function confirmCompletion(
  contractId: string,
  accessToken: string,
): Promise<{ status: string; escrow_held: string; total_paid: string }> {
  const { data } = await backendPost<{
    status: string;
    escrow_held: string;
    total_paid: string;
  }>(
    `/api/contracts/${contractId}/complete/`,
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return CompletionResponseSchema.parse(data);
}

/** Reject completion request (client) */
export async function rejectCompletion(
  contractId: string,
  message: string,
  accessToken: string,
): Promise<{ status: string }> {
  const { data } = await backendPost<{ status: string }>(
    `/api/contracts/${contractId}/completion-reject/`,
    { confirm: false, response_message: message },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return data;
}

/** Get execution history */
export async function getExecutionHistory(
  contractId: string,
  accessToken: string,
): Promise<ExecutionHistoryEvent[]> {
  const { data } = await backendGet<ExecutionHistoryEvent[]>(
    `/api/contracts/${contractId}/execution-history/`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return ExecutionHistoryListSchema.parse(data);
}
