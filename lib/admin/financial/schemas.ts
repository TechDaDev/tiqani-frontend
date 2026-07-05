import { z } from "zod";

const partySchema = z
  .object({
    id: z.string().default(""),
    name: z.string().default(""),
  })
  .nullable()
  .catch(null);

const richPartySchema = z
  .object({
    id: z.string().default(""),
    name: z.string().default(""),
    email: z.string().optional().default(""),
    username: z.string().optional().default(""),
  })
  .nullable()
  .catch(null);

const chartItemSchema = z.object({
  label: z.string().default(""),
  value: z.union([z.string(), z.number()]).default(0),
  count: z.number().optional(),
});

export const financialAuditEventSchema = z.object({
  id: z.string().default(""),
  verb: z.string().default(""),
  actor: partySchema,
  target_type: z.string().default(""),
  target_id: z.string().default(""),
  target_repr: z.string().default(""),
  amount: z.string().default(""),
  reason: z.string().default(""),
  previous_state: z.record(z.unknown()).default({}),
  new_state: z.record(z.unknown()).default({}),
  source_service: z.string().default(""),
  created_at: z.string().default(""),
});

export const financialOverviewSchema = z.object({
  summary: z.object({
    grossPayments: z.string().default("0.00"),
    netPlatformFees: z.string().default("0.00"),
    pendingWithdrawals: z.string().default("0.00"),
    completedWithdrawals: z.string().default("0.00"),
    approvedWalletRecharges: z.string().default("0.00"),
    refundsIssued: z.string().default("0.00"),
    escrowHeld: z.string().default("0.00"),
    openLiabilities: z.string().default("0.00"),
    walletBalanceTotal: z.string().default("0.00"),
  }),
  counts: z.object({
    payments: z.number().default(0),
    refunds: z.number().default(0),
    withdrawalsPending: z.number().default(0),
    withdrawalsCompleted: z.number().default(0),
    walletRechargeRequestsPending: z.number().default(0),
    walletRechargeRequestsApproved: z.number().default(0),
    walletRechargeRequestsRejected: z.number().default(0),
    ledgerEntries: z.number().default(0),
    escrowContracts: z.number().default(0),
  }),
  charts: z.object({
    paymentsByStatus: z.array(chartItemSchema).default([]),
    withdrawalsByStatus: z.array(chartItemSchema).default([]),
    walletRechargesByStatus: z.array(chartItemSchema).default([]),
    refundsByReason: z.array(chartItemSchema).default([]),
    ledgerByType: z.array(chartItemSchema).default([]),
    monthlyFlow: z.array(chartItemSchema).default([]),
  }),
  recentActivity: z.array(financialAuditEventSchema).default([]),
});

export const financialRechargeRequestSchema = z.object({
  id: z.string().default(""),
  user: richPartySchema,
  amount: z.string().default("0.00"),
  currency: z.string().default("IQD"),
  note: z.string().default(""),
  status: z.string().default(""),
  receipt_download_url: z.string().default(""),
  original_filename: z.string().default(""),
  file_size: z.number().nullable().default(null),
  mime_type: z.string().default(""),
  reviewed_by: richPartySchema,
  reviewed_at: z.string().nullable().default(""),
  review_note: z.string().default(""),
  approved_transaction_id: z.string().nullable().default(""),
  created_at: z.string().default(""),
  updated_at: z.string().default(""),
});

export const financialPaymentSchema = z.object({
  id: z.string().default(""),
  contract: z.string().default(""),
  contract_reference: z.string().default(""),
  payer: partySchema,
  amount: z.string().default("0.00"),
  currency: z.string().default("IQD"),
  purpose: z.string().default(""),
  provider: z.string().default(""),
  provider_reference_masked: z.string().default(""),
  status: z.string().default(""),
  paid_at: z.string().nullable().default(""),
  created_at: z.string().default(""),
  updated_at: z.string().default(""),
});

export const financialRefundSchema = z.object({
  id: z.string().default(""),
  contract: z.string().default(""),
  contract_reference: z.string().default(""),
  dispute_id: z.string().default(""),
  client: partySchema,
  technician: partySchema,
  amount: z.string().default("0.00"),
  currency: z.string().default("IQD"),
  source_type: z.string().default(""),
  status: z.string().default(""),
  refund_method: z.string().default(""),
  provider_reference_masked: z.string().default(""),
  reconciliation: z.record(z.unknown()).default({}),
  initiated_at: z.string().default(""),
  completed_at: z.string().nullable().default(""),
  created_at: z.string().default(""),
  updated_at: z.string().default(""),
});

export const financialWithdrawalSchema = z.object({
  id: z.string().default(""),
  user: partySchema,
  amount: z.string().default("0.00"),
  currency: z.string().default("IQD"),
  status: z.string().default(""),
  requested_method_masked: z.string().default(""),
  notes: z.string().default(""),
  admin_note: z.string().default(""),
  reviewed_at: z.string().nullable().default(""),
  paid_at: z.string().nullable().default(""),
  created_at: z.string().default(""),
  updated_at: z.string().default(""),
});

export const financialLedgerEntrySchema = z.object({
  id: z.string().default(""),
  user: partySchema,
  wallet: z.string().default(""),
  contract: z.string().default(""),
  transaction_type: z.string().default(""),
  direction: z.string().default(""),
  amount: z.string().default("0.00"),
  source_object: z.object({ type: z.string().default(""), id: z.string().default("") }),
  description: z.string().default(""),
  created_at: z.string().default(""),
  updated_at: z.string().default(""),
});

export const financialEscrowSchema = z.object({
  id: z.string().default(""),
  contract: z.string().default(""),
  contract_reference: z.string().default(""),
  title: z.string().default(""),
  client: partySchema,
  technician: partySchema,
  escrow_amount: z.string().default("0.00"),
  released_principal: z.string().default("0.00"),
  technician_net_amount: z.string().default("0.00"),
  total_platform_fee: z.string().default("0.00"),
  currency: z.string().default("IQD"),
  status: z.string().default(""),
  initiated_at: z.string().default(""),
  settled_at: z.string().nullable().default(""),
  dispute_state: z.string().default(""),
  refund_state: z.string().default(""),
  created_at: z.string().default(""),
  updated_at: z.string().default(""),
});
