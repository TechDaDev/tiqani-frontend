import { mapPaginated } from "@/lib/admin/mappers";
import type {
  AdminFinancialAuditEvent,
  AdminFinancialEscrow,
  AdminFinancialLedgerEntry,
  AdminFinancialOverview,
  AdminFinancialPayment,
  AdminFinancialRechargeRequest,
  AdminFinancialRefund,
  AdminFinancialWithdrawal,
} from "./types";
import {
  financialAuditEventSchema,
  financialEscrowSchema,
  financialLedgerEntrySchema,
  financialOverviewSchema,
  financialPaymentSchema,
  financialRechargeRequestSchema,
  financialRefundSchema,
  financialWithdrawalSchema,
} from "./schemas";

export function mapFinancialAuditEvent(data: unknown): AdminFinancialAuditEvent {
  const item = financialAuditEventSchema.parse(data ?? {});
  return {
    id: item.id,
    verb: item.verb,
    actor: item.actor,
    targetType: item.target_type,
    targetId: item.target_id,
    targetRepr: item.target_repr,
    amount: item.amount,
    reason: item.reason,
    previousState: item.previous_state,
    newState: item.new_state,
    sourceService: item.source_service,
    createdAt: item.created_at,
  };
}

export function mapFinancialOverview(data: unknown): AdminFinancialOverview {
  const item = financialOverviewSchema.parse(data ?? {});
  return {
    ...item,
    recentActivity: item.recentActivity.map(mapFinancialAuditEvent),
  };
}

export function mapFinancialPayment(data: unknown): AdminFinancialPayment {
  const item = financialPaymentSchema.parse(data ?? {});
  return {
    id: item.id,
    contract: item.contract,
    contractReference: item.contract_reference,
    payer: item.payer,
    amount: item.amount,
    currency: item.currency,
    purpose: item.purpose,
    provider: item.provider,
    providerReferenceMasked: item.provider_reference_masked,
    status: item.status,
    paidAt: item.paid_at || "",
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export function mapFinancialRefund(data: unknown): AdminFinancialRefund {
  const item = financialRefundSchema.parse(data ?? {});
  return {
    id: item.id,
    contract: item.contract,
    contractReference: item.contract_reference,
    disputeId: item.dispute_id,
    client: item.client,
    technician: item.technician,
    amount: item.amount,
    currency: item.currency,
    sourceType: item.source_type,
    status: item.status,
    refundMethod: item.refund_method,
    providerReferenceMasked: item.provider_reference_masked,
    reconciliation: item.reconciliation,
    initiatedAt: item.initiated_at,
    completedAt: item.completed_at || "",
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export function mapFinancialWithdrawal(data: unknown): AdminFinancialWithdrawal {
  const item = financialWithdrawalSchema.parse(data ?? {});
  return {
    id: item.id,
    user: item.user,
    amount: item.amount,
    currency: item.currency,
    status: item.status,
    requestedMethodMasked: item.requested_method_masked,
    notes: item.notes,
    adminNote: item.admin_note,
    reviewedAt: item.reviewed_at || "",
    paidAt: item.paid_at || "",
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export function mapFinancialRechargeRequest(data: unknown): AdminFinancialRechargeRequest {
  const item = financialRechargeRequestSchema.parse(data ?? {});
  return {
    id: item.id,
    user: item.user,
    amount: item.amount,
    currency: item.currency,
    note: item.note,
    status: item.status,
    receiptDownloadUrl: item.receipt_download_url,
    originalFilename: item.original_filename,
    fileSize: item.file_size,
    mimeType: item.mime_type,
    reviewedBy: item.reviewed_by,
    reviewedAt: item.reviewed_at || "",
    reviewNote: item.review_note,
    approvedTransactionId: item.approved_transaction_id || "",
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export function mapFinancialLedgerEntry(data: unknown): AdminFinancialLedgerEntry {
  const item = financialLedgerEntrySchema.parse(data ?? {});
  return {
    id: item.id,
    user: item.user,
    wallet: item.wallet,
    contract: item.contract,
    transactionType: item.transaction_type,
    direction: item.direction,
    amount: item.amount,
    sourceObject: item.source_object,
    description: item.description,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export function mapFinancialEscrow(data: unknown): AdminFinancialEscrow {
  const item = financialEscrowSchema.parse(data ?? {});
  return {
    id: item.id,
    contract: item.contract,
    contractReference: item.contract_reference,
    title: item.title,
    client: item.client,
    technician: item.technician,
    escrowAmount: item.escrow_amount,
    releasedPrincipal: item.released_principal,
    technicianNetAmount: item.technician_net_amount,
    totalPlatformFee: item.total_platform_fee,
    currency: item.currency,
    status: item.status,
    initiatedAt: item.initiated_at,
    settledAt: item.settled_at || "",
    disputeState: item.dispute_state,
    refundState: item.refund_state,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export const mapFinancialPayments = (data: unknown) => mapPaginated(data, mapFinancialPayment);
export const mapFinancialRefunds = (data: unknown) => mapPaginated(data, mapFinancialRefund);
export const mapFinancialWithdrawals = (data: unknown) => mapPaginated(data, mapFinancialWithdrawal);
export const mapFinancialRechargeRequests = (data: unknown) => mapPaginated(data, mapFinancialRechargeRequest);
export const mapFinancialLedger = (data: unknown) => mapPaginated(data, mapFinancialLedgerEntry);
export const mapFinancialEscrowList = (data: unknown) => mapPaginated(data, mapFinancialEscrow);
export const mapFinancialAudit = (data: unknown) => mapPaginated(data, mapFinancialAuditEvent);
