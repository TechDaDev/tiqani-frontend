/**
 * Payment domain types — provider-neutral, private-field stripped.
 */

/** Derived funding status — computed from backend PaymentIntent records */
export type FundingStatus = "unfunded" | "pending" | "funded" | "failed";

export interface FundingEligibility {
  contract_id: string;
  contract_reference: string;
  eligible: boolean;
  reason: string | null;
  funding_status: FundingStatus;
  agreed_amount: string | null;
  currency: string;
  client_total_amount?: string;
  client_service_fee?: string;
  technician_commission?: string;
}

export interface PaymentIntent {
  id: string;
  contract: string;
  user: string;
  amount: string;
  currency: string;
  purpose: string;
  provider: string;
  provider_reference: string;
  status: string;
  metadata: Record<string, unknown>;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractFundingStatus {
  contract_id: string;
  contract_reference: string;
  funding_status: FundingStatus;
  escrow_amount: string;
  agreed_amount: string | null;
  currency: string;
  active_intent: {
    id: string;
    status: string;
    amount: string;
    created_at: string | null;
  } | null;
  message?: string;
}

export interface SandboxConfirmResult {
  payment_intent: PaymentIntent;
  provider_result: {
    success: boolean;
    provider: string;
    provider_reference: string | null;
    error_code: string | null;
    error_message: string | null;
  };
}
