/** Refund Zod schemas. */
import { z } from "zod";
import { DecimalString, IsoDatetime } from "@/lib/settlement/schemas";

export const RefundRecordSchema = z.object({
  id: z.string().uuid(),
  dispute: z.string().uuid(),
  contract: z.string().uuid(),
  client: z.string().uuid(),
  amount: DecimalString,
  currency: z.string(),
  source_type: z.enum([
    "escrow", "technician_wallet_reversal", "platform_fee_reversal",
    "split_sources", "manual_recovery", "sandbox_provider",
  ]),
  source_type_display: z.string(),
  status: z.enum(["pending", "processing", "completed", "failed", "canceled", "partially_completed"]),
  status_display: z.string(),
  refund_method: z.string(),
  provider_reference: z.string(),
  wallet_transaction: z.string().uuid().nullable(),
  created_by: z.string().uuid(),
  initiated_at: IsoDatetime,
  completed_at: IsoDatetime.nullable(),
  failed_at: IsoDatetime.nullable(),
  failure_code: z.string(),
  failure_message: z.string(),
});

export const LiabilitySchema = z.object({
  id: z.string().uuid(),
  user: z.string().uuid(),
  source_dispute: z.string().uuid(),
  original_amount: DecimalString,
  recovered_amount: DecimalString,
  remaining_amount: DecimalString,
  status: z.string(),
  status_display: z.string(),
  created_at: IsoDatetime,
  updated_at: IsoDatetime,
});
