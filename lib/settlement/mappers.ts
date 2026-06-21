/**
 * Settlement response mappers.
 */
import type { Settlement, SettlementEligibility, FinancialSummary, SettlementStatus } from "./types";

export function mapSettlement(data: Record<string, unknown>): Settlement {
  return {
    id: String(data.id ?? ""),
    contract: String(data.contract ?? ""),
    released_principal: String(data.released_principal ?? "0.00"),
    technician_net_amount: String(data.technician_net_amount ?? "0.00"),
    technician_commission_amount: String(data.technician_commission_amount ?? "0.00"),
    client_service_fee_amount: String(data.client_service_fee_amount ?? "0.00"),
    total_platform_fee: String(data.total_platform_fee ?? "0.00"),
    currency: String(data.currency ?? "IQD"),
    status: (String(data.status ?? "pending") as SettlementStatus),
    initiated_by: data.initiated_by ? String(data.initiated_by) : undefined,
    initiated_at: String(data.initiated_at ?? ""),
    completed_at: data.completed_at ? String(data.completed_at) : undefined,
    failed_at: data.failed_at ? String(data.failed_at) : undefined,
    failure_code: String(data.failure_code ?? ""),
    failure_message: String(data.failure_message ?? ""),
    idempotency_key: data.idempotency_key ? String(data.idempotency_key) : undefined,
    created_at: String(data.created_at ?? ""),
    updated_at: String(data.updated_at ?? ""),
  };
}

export function mapSettlementEligibility(data: Record<string, unknown>): SettlementEligibility {
  return {
    eligible: Boolean(data.eligible),
    reason: data.reason ? String(data.reason) : null,
  };
}

export function mapFinancialSummary(data: Record<string, unknown>): FinancialSummary {
  const breakdown = (data.payment_breakdown as Record<string, unknown>) ?? {};
  const settlement = data.settlement
    ? (data.settlement as Record<string, unknown>)
    : null;
  return {
    contract_id: String(data.contract_id ?? ""),
    contract_reference: String(data.contract_reference ?? ""),
    contract_status: String(data.contract_status ?? ""),
    agreed_amount: String(data.agreed_amount ?? "0.00"),
    escrow_amount: String(data.escrow_amount ?? "0.00"),
    total_paid: String(data.total_paid ?? "0.00"),
    funding_status: String(data.funding_status ?? ""),
    payment_breakdown: {
      contract_amount: String(breakdown.contract_amount ?? "0.00"),
      technician_commission_amount: String(breakdown.technician_commission_amount ?? "0.00"),
      client_service_fee_amount: String(breakdown.client_service_fee_amount ?? "0.00"),
      total_platform_fee: String(breakdown.total_platform_fee ?? "0.00"),
      client_total_amount: String(breakdown.client_total_amount ?? "0.00"),
      technician_net_amount: String(breakdown.technician_net_amount ?? "0.00"),
      currency: String(breakdown.currency ?? "IQD"),
    },
    settlement: settlement
      ? {
          id: String(settlement.id ?? ""),
          status: String(settlement.status ?? "") as SettlementStatus,
          released_principal: String(settlement.released_principal ?? "0.00"),
          technician_net_amount: String(settlement.technician_net_amount ?? "0.00"),
          technician_commission_amount: String(settlement.technician_commission_amount ?? "0.00"),
          client_service_fee_amount: String(settlement.client_service_fee_amount ?? "0.00"),
          total_platform_fee: String(settlement.total_platform_fee ?? "0.00"),
          completed_at: settlement.completed_at ? String(settlement.completed_at) : undefined,
        }
      : null,
  };
}
