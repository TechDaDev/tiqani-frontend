/** Chargeback Zod schemas. */
import { z } from "zod";
import { DecimalString, IsoDatetime } from "@/lib/settlement/schemas";

export const ChargebackEventSchema = z.object({
  id: z.string().uuid(),
  contract: z.string().uuid(),
  contract_reference: z.string(),
  dispute: z.string().uuid().nullable(),
  provider_reference: z.string(),
  amount: DecimalString,
  reason_code: z.string(),
  received_at: IsoDatetime,
  evidence_deadline: IsoDatetime.nullable(),
  status: z.enum([
    "received", "under_review", "evidence_submitted",
    "upheld", "rejected", "partially_upheld", "closed",
  ]),
  status_display: z.string(),
  outcome: z.string(),
  resolved_by: z.string().uuid().nullable(),
  resolved_at: IsoDatetime.nullable(),
});

export const ChargebackSandboxCreateSchema = z.object({
  contract_id: z.string().uuid(),
  amount: DecimalString,
  reason_code: z.string().max(50).optional().default(""),
  idempotency_key: z.string().max(64).optional().nullable(),
});

export const ChargebackActionSchema = z.object({
  idempotency_key: z.string().max(64).optional().nullable(),
});

export const ChargebackPartialSchema = z.object({
  partial_amount: DecimalString,
  idempotency_key: z.string().max(64).optional().nullable(),
});
