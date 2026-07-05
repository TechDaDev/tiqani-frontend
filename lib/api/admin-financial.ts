import { browserClient } from "@/lib/api/browser-client";
import {
  mapFinancialAudit,
  mapFinancialEscrowList,
  mapFinancialLedger,
  mapFinancialOverview,
  mapFinancialPayments,
  mapFinancialRechargeRequest,
  mapFinancialRechargeRequests,
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

export async function fetchFinancialRechargeRequests(query = "") {
  return mapFinancialRechargeRequests(await browserClient.get(`/api/admin/financial/recharge-requests/${suffix(query)}`));
}

export async function approveFinancialRechargeRequest(id: string, reviewNote = "") {
  return mapFinancialRechargeRequest(
    await browserClient.post(`/api/admin/financial/recharge-requests/${id}/approve/`, {
      review_note: reviewNote,
    })
  );
}

export async function rejectFinancialRechargeRequest(id: string, reviewNote: string) {
  return mapFinancialRechargeRequest(
    await browserClient.post(`/api/admin/financial/recharge-requests/${id}/reject/`, {
      review_note: reviewNote,
    })
  );
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
