/**
 * Wallet API client functions.
 */
import type { WalletInfo, WalletTransaction, AvailableBalance } from "@/lib/wallet/types";
import { mapWalletInfo, mapWalletTransaction, mapAvailableBalance } from "@/lib/wallet/mappers";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return response.json();
}

export async function fetchWallet(): Promise<WalletInfo> {
  const data = await apiFetch<Record<string, unknown>>("/api/wallet/me/");
  return mapWalletInfo(data);
}

export async function fetchWalletTransactions(
  filters?: { transaction_type?: string; created_after?: string; created_before?: string }
): Promise<WalletTransaction[]> {
  const params = new URLSearchParams();
  if (filters?.transaction_type) params.set("transaction_type", filters.transaction_type);
  if (filters?.created_after) params.set("created_after", filters.created_after);
  if (filters?.created_before) params.set("created_before", filters.created_before);
  const qs = params.toString();
  const data = await apiFetch<Record<string, unknown>[]>(
    `/api/wallet/transactions/${qs ? "?" + qs : ""}`
  );
  return data.map(mapWalletTransaction);
}

export async function fetchAvailableBalance(): Promise<AvailableBalance> {
  const data = await apiFetch<Record<string, unknown>>("/api/wallet/available-balance/");
  return mapAvailableBalance(data);
}
