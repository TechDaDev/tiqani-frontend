/**
 * Wallet domain types.
 */

export type WalletTransactionType =
  | "deposit"
  | "withdrawal"
  | "payment"
  | "refund"
  | "escrow"
  | "release"
  | "platform_fee";

export interface WalletInfo {
  user_id: string;
  balance: string;
  transaction_id: string;
  updated_at: string;
  recent_transactions?: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  wallet: string;
  contract?: string;
  transaction_type: WalletTransactionType;
  amount: string;
  amount_usd?: string;
  exchange_rate?: string;
  description: string;
  created_at: string;
}

export interface AvailableBalance {
  total_balance: string;
  reserved_balance: string;
  available_balance: string;
  currency: string;
}
