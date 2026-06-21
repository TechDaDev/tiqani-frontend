/**
 * Withdrawal Zod schemas.
 */
import { z } from "zod";

export const WithdrawalRequestSchema = z.object({
  id: z.string().uuid(),
  user: z.string().uuid(),
  wallet: z.string(),
  amount: z.string(),
  currency: z.string(),
  status: z.enum([
    "pending", "approved", "processing", "rejected",
    "paid", "failed", "canceled",
  ]),
  requested_method: z.string(),
  notes: z.string(),
  admin_note: z.string(),
  reviewed_at: z.string().nullable(),
  paid_at: z.string().nullable(),
  failure_code: z.string(),
  failure_message: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const WithdrawalCreateSchema = z.object({
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  requested_method: z.string().max(50).optional(),
  notes: z.string().max(2000).optional(),
});
