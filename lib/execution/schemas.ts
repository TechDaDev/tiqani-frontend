/** Execution domain Zod schemas — validates backend API responses */

import { z } from "zod";

export const ContractExecutionEligibilitySchema = z.object({
  eligible: z.boolean(),
  reason: z.string(),
  contract_status: z.string(),
  funding_status: z.string(),
  milestone_count: z.number(),
  can_activate: z.boolean(),
  can_request_completion: z.boolean(),
  can_confirm_completion: z.boolean(),
});

export const ExecutionHistoryEventSchema = z.object({
  id: z.string().uuid(),
  contract: z.string().uuid(),
  event_type: z.string(),
  actor: z.string().uuid().nullable(),
  actor_name: z.string().nullable(),
  payload: z.record(z.unknown()).nullable(),
  created_at: z.string(),
});

export const ExecutionHistoryListSchema = z.array(ExecutionHistoryEventSchema);

export const CompletionRequestSchema = z.object({
  id: z.string().uuid(),
  contract: z.string().uuid(),
  requested_by: z.string().uuid(),
  requested_by_name: z.string(),
  completion_message: z.string(),
  status: z.string(),
  response_message: z.string().nullable(),
  responded_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ActivationResponseSchema = z.object({
  status: z.string(),
  activated_at: z.string(),
});

export const CompletionResponseSchema = z.object({
  status: z.string(),
  escrow_held: z.string(),
  total_paid: z.string(),
});

export const CompletionRequestResponseSchema = z.object({
  status: z.string(),
});

export const RejectCompletionSchema = z.object({
  confirm: z.boolean(),
  response_message: z.string().optional(),
});
