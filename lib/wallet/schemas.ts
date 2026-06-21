/**
 * Wallet Zod schemas.
 */
import { z } from "zod";

export const WalletTransactionSchema = z.object({
  id: z.string().uuid(),
  wallet: z.string(),
  contract: z.string().uuid().nullable(),
  transaction_type: z.enum([
    "deposit", "withdrawal", "payment", "refund",
    "escrow", "release", "platform_fee",
  ]),
  amount: z.string(),
  description: z.string(),
  created_at: z.string(),
});

export const AvailableBalanceSchema = z.object({
  total_balance: z.string(),
  reserved_balance: z.string(),
  available_balance: z.string(),
  currency: z.string(),
});

export const WalletInfoSchema = z.object({
  user_id: z.string().uuid(),
  balance: z.string(),
  transaction_id: z.string(),
  updated_at: z.string(),
  recent_transactions: z.array(WalletTransactionSchema).optional(),
});
