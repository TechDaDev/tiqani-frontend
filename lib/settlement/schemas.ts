/**
 * Settlement Zod schemas.
 */
import { z } from "zod";

export const SettlementSchema = z.object({
  id: z.string().uuid(),
  contract: z.string().uuid(),
  released_principal: z.string(),
  technician_net_amount: z.string(),
  technician_commission_amount: z.string(),
  client_service_fee_amount: z.string(),
  total_platform_fee: z.string(),
  currency: z.string(),
  status: z.enum(["pending", "processing", "completed", "failed", "reversed"]),
  initiated_by: z.string().uuid().nullable(),
  initiated_at: z.string(),
  completed_at: z.string().nullable(),
  failed_at: z.string().nullable(),
  failure_code: z.string(),
  failure_message: z.string(),
  idempotency_key: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const SettlementEligibilitySchema = z.object({
  eligible: z.boolean(),
  reason: z.string().nullable(),
});

export const SettlementCreateSchema = z.object({
  idempotency_key: z.string().max(64).optional(),
});

export const FinancialSummarySchema = z.object({
  contract_id: z.string().uuid(),
  contract_reference: z.string(),
  contract_status: z.string(),
  agreed_amount: z.string(),
  escrow_amount: z.string(),
  total_paid: z.string(),
  funding_status: z.string(),
  payment_breakdown: z.object({
    contract_amount: z.string(),
    technician_commission_amount: z.string(),
    client_service_fee_amount: z.string(),
    total_platform_fee: z.string(),
    client_total_amount: z.string(),
    technician_net_amount: z.string(),
    currency: z.string(),
  }),
  settlement: z
    .object({
      id: z.string().uuid(),
      status: z.string(),
      released_principal: z.string(),
      technician_net_amount: z.string(),
      technician_commission_amount: z.string(),
      client_service_fee_amount: z.string(),
      total_platform_fee: z.string(),
      completed_at: z.string().optional(),
    })
    .nullable(),
});
