/**
 * Wallet response mappers.
 */
import { WalletRechargeRequestSchema } from "./schemas";
import type { WalletInfo, WalletTransaction, AvailableBalance, WalletRechargeRequest } from "./types";

export function mapWalletInfo(data: Record<string, unknown>): WalletInfo {
  const recentTxns = (data.recent_transactions as Record<string, unknown>[]) ?? [];
  return {
    user_id: String(data.user_id ?? ""),
    balance: String(data.balance ?? "0.00"),
    transaction_id: String(data.transaction_id ?? ""),
    updated_at: String(data.updated_at ?? ""),
    recent_transactions: recentTxns.map(mapWalletTransaction),
  };
}

export function mapWalletTransaction(data: Record<string, unknown>): WalletTransaction {
  return {
    id: String(data.id ?? ""),
    wallet: String(data.wallet ?? ""),
    contract: data.contract ? String(data.contract) : undefined,
    transaction_type: data.transaction_type as WalletTransaction["transaction_type"],
    amount: String(data.amount ?? "0.00"),
    amount_usd: data.amount_usd ? String(data.amount_usd) : undefined,
    exchange_rate: data.exchange_rate ? String(data.exchange_rate) : undefined,
    description: String(data.description ?? ""),
    created_at: String(data.created_at ?? ""),
  };
}

export function mapAvailableBalance(data: Record<string, unknown>): AvailableBalance {
  return {
    total_balance: String(data.total_balance ?? "0.00"),
    reserved_balance: String(data.reserved_balance ?? "0.00"),
    available_balance: String(data.available_balance ?? "0.00"),
    currency: String(data.currency ?? "IQD"),
  };
}

export function mapWalletRechargeRequest(data: unknown): WalletRechargeRequest {
  const item = WalletRechargeRequestSchema.parse(data ?? {});
  return {
    id: item.id,
    amount: item.amount,
    currency: item.currency,
    note: item.note,
    status: item.status,
    receiptDownloadUrl: item.receipt_download_url,
    originalFilename: item.original_filename,
    fileSize: item.file_size,
    mimeType: item.mime_type,
    reviewedAt: item.reviewed_at || "",
    reviewNote: item.review_note,
    approvedTransactionId: item.approved_transaction_id,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export function mapWalletRechargeRequests(data: unknown): WalletRechargeRequest[] {
  return Array.isArray(data) ? data.map(mapWalletRechargeRequest) : [];
}
