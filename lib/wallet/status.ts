/**
 * Wallet transaction status helpers.
 */
import type { WalletTransactionType } from "./types";

export const TRANSACTION_TYPE_LABELS: Record<WalletTransactionType, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  payment: "Payment",
  refund: "Refund",
  escrow: "Escrow",
  release: "Release",
  platform_fee: "Platform Fee",
};

export const TRANSACTION_TYPE_COLORS: Record<WalletTransactionType, string> = {
  deposit: "bg-green-100 text-green-800",
  withdrawal: "bg-red-100 text-red-800",
  payment: "bg-blue-100 text-blue-800",
  refund: "bg-purple-100 text-purple-800",
  escrow: "bg-yellow-100 text-yellow-800",
  release: "bg-teal-100 text-teal-800",
  platform_fee: "bg-orange-100 text-orange-800",
};

export function getTransactionTypeLabel(type: WalletTransactionType): string {
  return TRANSACTION_TYPE_LABELS[type] ?? type;
}

export function getTransactionTypeColor(type: WalletTransactionType): string {
  return TRANSACTION_TYPE_COLORS[type] ?? "bg-gray-100 text-gray-800";
}
