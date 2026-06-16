/**
 * Payments API client — all calls go through Next.js proxy routes.
 */
import { browserRequest } from "./browser-client";
import type {
  FundingEligibility,
  ContractFundingStatus,
  PaymentIntent,
  SandboxConfirmResult,
} from "@/lib/payments/types";

/** Check if a contract is eligible for funding */
export async function getFundingEligibility(
  contractId: string
): Promise<FundingEligibility> {
  const res = await browserRequest<FundingEligibility>(
    `/api/contracts/${contractId}/funding/eligibility/`
  );
  return res;
}

/** Create a payment intent for contract funding */
export async function createPaymentIntent(
  contractId: string
): Promise<PaymentIntent> {
  const res = await browserRequest<PaymentIntent>(
    `/api/contracts/${contractId}/funding/intents/`,
    { method: "POST" }
  );
  return res;
}

/** Get contract funding status */
export async function getContractFundingStatus(
  contractId: string
): Promise<ContractFundingStatus> {
  const res = await browserRequest<ContractFundingStatus>(
    `/api/contracts/${contractId}/funding/status/`
  );
  return res;
}

/** Confirm sandbox payment (simulate success or failure) */
export async function sandboxConfirmPayment(
  intentId: string,
  simulateFailure = false
): Promise<SandboxConfirmResult> {
  const res = await browserRequest<SandboxConfirmResult>(
    `/api/payments/${intentId}/sandbox-confirm/`,
    {
      method: "POST",
      body: { simulate_failure: simulateFailure },
    }
  );
  return res;
}
