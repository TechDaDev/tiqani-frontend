import { browserClient } from "@/lib/api/browser-client";
import {
  mapFinancialAudit,
  mapFinancialEscrowList,
  mapFinancialLedger,
  mapFinancialOverview,
  mapFinancialPayments,
  mapFinancialRefunds,
  mapFinancialWithdrawals,
} from "@/lib/admin/financial/mappers";

function suffix(query = "") {
  return query ? `?${query}` : "";
}

export async function fetchFinancialOverview() {
  return mapFinancialOverview(await browserClient.get("/api/admin/financial/overview/"));
}

export async function fetchFinancialPayments(query = "") {
  return mapFinancialPayments(await browserClient.get(`/api/admin/financial/payments/${suffix(query)}`));
}

export async function fetchFinancialRefunds(query = "") {
  return mapFinancialRefunds(await browserClient.get(`/api/admin/financial/refunds/${suffix(query)}`));
}

export async function fetchFinancialWithdrawals(query = "") {
  return mapFinancialWithdrawals(await browserClient.get(`/api/admin/financial/withdrawals/${suffix(query)}`));
}

export async function fetchFinancialLedger(query = "") {
  return mapFinancialLedger(await browserClient.get(`/api/admin/financial/ledger/${suffix(query)}`));
}

export async function fetchFinancialEscrow(query = "") {
  return mapFinancialEscrowList(await browserClient.get(`/api/admin/financial/escrow/${suffix(query)}`));
}

export async function fetchFinancialAudit(query = "") {
  return mapFinancialAudit(await browserClient.get(`/api/admin/financial/audit/${suffix(query)}`));
}
