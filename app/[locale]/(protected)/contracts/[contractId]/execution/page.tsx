"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { browserRequest } from "@/lib/api/browser-client";
import { useAuth } from "@/components/auth/auth-provider";
import { isClient } from "@/lib/auth/guards";
import { ContractExecutionStatus } from "@/components/execution/contract-execution-status";
import { ExecutionProgress } from "@/components/execution/execution-progress";
import { ExecutionActions } from "@/components/execution/execution-actions";
import { EscrowHeldNotice } from "@/components/execution/escrow-held-notice";
import { CompletionRequestCard } from "@/components/execution/completion-request-card";
import type { ContractExecutionEligibility, CompletionRequest } from "@/lib/execution/types";
import type { ContractExecutionStatus as CES } from "@/lib/execution/types";
import { CONTRACT_EXECUTION_STATUS } from "@/lib/execution/types";

export default function ExecutionPage() {
  const params = useParams();
  const contractId = params.contractId as string;
  const t = useTranslations("execution");
  const { user } = useAuth();
  const role = user?.role ?? "client";
  const isClientRole = isClient(role);

  const [eligibility, setEligibility] = useState<ContractExecutionEligibility | null>(null);
  const [contractStatus, setContractStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    setLoading(true);
    try {
      const [eligData, contractData] = await Promise.all([
        browserRequest<ContractExecutionEligibility>(
          `/api/contracts/${contractId}/execution/eligibility/`,
        ),
        browserRequest<Record<string, unknown>>(
          `/api/contracts/${contractId}/`,
        ),
      ]);
      setEligibility(eligData);
      setContractStatus(contractData.status as string);
      setError(null);
    } catch (e) {
      setError(t("genericError"));
    } finally {
      setLoading(false);
    }
  }, [contractId, t]);

  useEffect(() => { fetchState(); }, [fetchState]);

  const handleActivate = useCallback(async () => {
    await browserRequest(`/api/contracts/${contractId}/activate/`, { method: "POST" });
    await fetchState();
  }, [contractId, fetchState]);

  const handleRequestCompletion = useCallback(async (message: string) => {
    await browserRequest(`/api/contracts/${contractId}/completion-request/`, {
      method: "POST",
      body: { completion_message: message },
    });
    await fetchState();
  }, [contractId, fetchState]);

  const handleConfirmCompletion = useCallback(async () => {
    await browserRequest(`/api/contracts/${contractId}/complete/`, { method: "POST" });
    await fetchState();
  }, [contractId, fetchState]);

  const handleRejectCompletion = useCallback(async (reason: string) => {
    await browserRequest(`/api/contracts/${contractId}/completion-reject/`, {
      method: "POST",
      body: { response_message: reason },
    });
    await fetchState();
  }, [contractId, fetchState]);

  const status = (contractStatus || eligibility?.contract_status || "") as CES;
  const isCompleted = status === CONTRACT_EXECUTION_STATUS.COMPLETED;
  const isCompletionRequested = status === CONTRACT_EXECUTION_STATUS.COMPLETION_REQUESTED;

  if (loading) return <div className="p-6"><p>{t("loading")}</p></div>;
  if (error) return <div className="p-6"><p className="text-red-500">{error}</p></div>;
  if (!eligibility) return <div className="p-6"><p>{t("noExecutionData")}</p></div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">{t("executionTitle")}</h1>

      <div className="flex items-center gap-3">
        <ContractExecutionStatus status={status} />
        <span className="text-sm text-gray-500">
          {t("fundingStatus")}: {eligibility.funding_status}
        </span>
      </div>

      {eligibility.milestone_count > 0 && (
        <section aria-labelledby="progress-heading">
          <h2 id="progress-heading" className="text-lg font-semibold mb-2">{t("progress")}</h2>
          <ExecutionProgress approvedCount={0} totalCount={eligibility.milestone_count} />
        </section>
      )}

      {!isCompleted && (
        <ExecutionActions
          status={status}
          isClient={isClientRole}
          milestoneCount={eligibility.milestone_count}
          onActivate={handleActivate}
          onRequestCompletion={handleRequestCompletion}
          onConfirmCompletion={handleConfirmCompletion}
          onRejectCompletion={handleRejectCompletion}
        />
      )}

      {isCompleted && (
        <EscrowHeldNotice />
      )}

      {isCompleted && (
        <EscrowHeldNotice />
      )}

      {!isCompleted && (
        <div className="flex gap-4">
          <Link href={`/contracts/${contractId}/milestones`} className="text-sm text-brand hover:underline">
            {t("viewMilestones")}
          </Link>
          <Link href={`/contracts/${contractId}/history`} className="text-sm text-brand hover:underline">
            {t("viewHistory")}
          </Link>
        </div>
      )}
    </div>
  );
}
