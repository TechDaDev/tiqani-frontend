export type MoneyString = string;

export type FinancialParty = {
  id: string;
  name: string;
};

export type FinancialChartItem = {
  label: string;
  value: number | string;
  count?: number;
};

export type AdminFinancialOverview = {
  summary: {
    grossPayments: MoneyString;
    netPlatformFees: MoneyString;
    pendingWithdrawals: MoneyString;
    completedWithdrawals: MoneyString;
    refundsIssued: MoneyString;
    escrowHeld: MoneyString;
    openLiabilities: MoneyString;
    walletBalanceTotal: MoneyString;
  };
  counts: {
    payments: number;
    refunds: number;
    withdrawalsPending: number;
    withdrawalsCompleted: number;
    ledgerEntries: number;
    escrowContracts: number;
  };
  charts: {
    paymentsByStatus: FinancialChartItem[];
    withdrawalsByStatus: FinancialChartItem[];
    refundsByReason: FinancialChartItem[];
    ledgerByType: FinancialChartItem[];
    monthlyFlow: FinancialChartItem[];
  };
  recentActivity: AdminFinancialAuditEvent[];
};

export type AdminFinancialPayment = {
  id: string;
  contract: string;
  contractReference: string;
  payer: FinancialParty | null;
  amount: MoneyString;
  currency: string;
  purpose: string;
  provider: string;
  providerReferenceMasked: string;
  status: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminFinancialRefund = {
  id: string;
  contract: string;
  contractReference: string;
  disputeId: string;
  client: FinancialParty | null;
  technician: FinancialParty | null;
  amount: MoneyString;
  currency: string;
  sourceType: string;
  status: string;
  refundMethod: string;
  providerReferenceMasked: string;
  reconciliation: Record<string, unknown>;
  initiatedAt: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminFinancialWithdrawal = {
  id: string;
  user: FinancialParty | null;
  amount: MoneyString;
  currency: string;
  status: string;
  requestedMethodMasked: string;
  notes: string;
  adminNote: string;
  reviewedAt: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminFinancialLedgerEntry = {
  id: string;
  user: FinancialParty | null;
  wallet: string;
  contract: string;
  transactionType: string;
  direction: string;
  amount: MoneyString;
  sourceObject: { type: string; id: string };
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminFinancialEscrow = {
  id: string;
  contract: string;
  contractReference: string;
  title: string;
  client: FinancialParty | null;
  technician: FinancialParty | null;
  escrowAmount: MoneyString;
  releasedPrincipal: MoneyString;
  technicianNetAmount: MoneyString;
  totalPlatformFee: MoneyString;
  currency: string;
  status: string;
  initiatedAt: string;
  settledAt: string;
  disputeState: string;
  refundState: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminFinancialAuditEvent = {
  id: string;
  verb: string;
  actor: FinancialParty | null;
  targetType: string;
  targetId: string;
  targetRepr: string;
  amount: string;
  reason: string;
  previousState: Record<string, unknown>;
  newState: Record<string, unknown>;
  sourceService: string;
  createdAt: string;
};
