/**
 * Withdrawal API client functions.
 */
import type { WithdrawalRequest, WithdrawalCreate } from "@/lib/withdrawals/types";
import { mapWithdrawalRequest, mapWithdrawalList } from "@/lib/withdrawals/mappers";

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

export async function fetchMyWithdrawals(): Promise<WithdrawalRequest[]> {
  const data = await apiFetch<Record<string, unknown>[]>("/api/wallet/withdrawals/");
  return mapWithdrawalList(data);
}

export async function createWithdrawal(payload: WithdrawalCreate): Promise<WithdrawalRequest> {
  const data = await apiFetch<Record<string, unknown>>("/api/wallet/withdrawals/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapWithdrawalRequest(data);
}

export async function fetchWithdrawalDetail(withdrawalId: string): Promise<WithdrawalRequest> {
  const data = await apiFetch<Record<string, unknown>>(
    `/api/wallet/withdrawals/${withdrawalId}/`
  );
  return mapWithdrawalRequest(data);
}

export async function cancelWithdrawal(withdrawalId: string): Promise<WithdrawalRequest> {
  const data = await apiFetch<Record<string, unknown>>(
    `/api/wallet/withdrawals/${withdrawalId}/cancel/`,
    { method: "POST" }
  );
  return mapWithdrawalRequest(data);
}

// ---- Staff endpoints ----

export async function fetchAdminWithdrawals(status?: string): Promise<WithdrawalRequest[]> {
  const params = status ? `?status=${status}` : "";
  const data = await apiFetch<Record<string, unknown>[]>(
    `/api/admin/withdrawals/${params}`
  );
  return mapWithdrawalList(data);
}

export async function approveWithdrawal(withdrawalId: string, adminNote?: string): Promise<WithdrawalRequest> {
  const data = await apiFetch<Record<string, unknown>>(
    `/api/admin/withdrawals/${withdrawalId}/approve/`,
    {
      method: "POST",
      body: JSON.stringify({ admin_note: adminNote ?? "" }),
    }
  );
  return mapWithdrawalRequest(data);
}

export async function rejectWithdrawal(withdrawalId: string, adminNote?: string): Promise<WithdrawalRequest> {
  const data = await apiFetch<Record<string, unknown>>(
    `/api/admin/withdrawals/${withdrawalId}/reject/`,
    {
      method: "POST",
      body: JSON.stringify({ admin_note: adminNote ?? "" }),
    }
  );
  return mapWithdrawalRequest(data);
}

export async function processWithdrawal(withdrawalId: string): Promise<WithdrawalRequest> {
  const data = await apiFetch<Record<string, unknown>>(
    `/api/admin/withdrawals/${withdrawalId}/process/`,
    { method: "POST" }
  );
  return mapWithdrawalRequest(data);
}

export async function sandboxConfirmWithdrawal(
  withdrawalId: string,
  simulateFailure?: boolean
): Promise<WithdrawalRequest> {
  const data = await apiFetch<Record<string, unknown>>(
    `/api/admin/withdrawals/${withdrawalId}/sandbox-confirm/`,
    {
      method: "POST",
      body: JSON.stringify({ simulate_failure: simulateFailure ?? false }),
    }
  );
  return mapWithdrawalRequest(data);
}

export async function retryWithdrawal(
  withdrawalId: string,
  simulateFailure?: boolean
): Promise<WithdrawalRequest> {
  const data = await apiFetch<Record<string, unknown>>(
    `/api/admin/withdrawals/${withdrawalId}/retry/`,
    {
      method: "POST",
      body: JSON.stringify({ simulate_failure: simulateFailure ?? false }),
    }
  );
  return mapWithdrawalRequest(data);
}
