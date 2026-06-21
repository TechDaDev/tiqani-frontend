/**
 * Settlement API client functions.
 */
import type { Settlement, SettlementEligibility, FinancialSummary } from "@/lib/settlement/types";
import { mapSettlement, mapSettlementEligibility, mapFinancialSummary } from "@/lib/settlement/mappers";

const BASE = "/api/contracts";

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

export async function fetchSettlementEligibility(contractId: string): Promise<SettlementEligibility> {
  const data = await apiFetch<Record<string, unknown>>(
    `${BASE}/${contractId}/settlement/eligibility/`
  );
  return mapSettlementEligibility(data);
}

export async function createSettlement(
  contractId: string,
  idempotencyKey?: string
): Promise<Settlement> {
  const data = await apiFetch<Record<string, unknown>>(
    `${BASE}/${contractId}/settlements/`,
    {
      method: "POST",
      body: JSON.stringify({ idempotency_key: idempotencyKey }),
    }
  );
  return mapSettlement(data);
}

export async function fetchSettlement(contractId: string): Promise<Settlement | null> {
  try {
    const data = await apiFetch<Record<string, unknown>>(
      `${BASE}/${contractId}/settlement/`
    );
    return mapSettlement(data);
  } catch {
    return null;
  }
}

export async function fetchFinancialSummary(contractId: string): Promise<FinancialSummary> {
  const data = await apiFetch<Record<string, unknown>>(
    `${BASE}/${contractId}/financial-summary/`
  );
  return mapFinancialSummary(data);
}
