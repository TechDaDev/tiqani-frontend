/**
 * Settlement domain types.
 * Mirrors backend ContractSettlement model.
 */

export type SettlementStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "reversed";

export interface Settlement {
  id: string;
  contract: string;
  released_principal: string;
  technician_net_amount: string;
  technician_commission_amount: string;
  client_service_fee_amount: string;
  total_platform_fee: string;
  currency: string;
  status: SettlementStatus;
  initiated_by?: string;
  initiated_at: string;
  completed_at: string | undefined;
  failed_at: string | undefined;
  failure_code: string;
  failure_message: string;
  idempotency_key?: string;
  created_at: string;
  updated_at: string;
}

export interface SettlementEligibility {
  eligible: boolean;
  reason: string | null;
}

export interface PaymentBreakdown {
  contract_amount: string;
  technician_commission_amount: string;
  client_service_fee_amount: string;
  total_platform_fee: string;
  client_total_amount: string;
  technician_net_amount: string;
  currency: string;
}

export interface SettlementSummary {
  id: string;
  status: SettlementStatus;
  released_principal: string;
  technician_net_amount: string;
  technician_commission_amount: string;
  client_service_fee_amount: string;
  total_platform_fee: string;
  completed_at: string | undefined;
}

export interface FinancialSummary {
  contract_id: string;
  contract_reference: string;
  contract_status: string;
  agreed_amount: string;
  escrow_amount: string;
  total_paid: string;
  funding_status: string;
  payment_breakdown: PaymentBreakdown;
  settlement: SettlementSummary | null;
}
