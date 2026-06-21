"use client";

import { useTranslations } from "next-intl";
import { SettlementStatusBadge } from "./settlement-status-badge";
import { SettlementBreakdown } from "./settlement-breakdown";
import type { FinancialSummary } from "@/lib/settlement/types";

interface Props {
  summary: FinancialSummary;
}

export function FinancialSummary({ summary }: Props) {
  const t = useTranslations("settlement");

  return (
    <div className="space-y-4" role="region" aria-label={t("financialSummary")}>
      <h2 className="text-lg font-semibold text-gray-900">{t("financialSummary")}</h2>
      <dl className="rounded-lg border p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-600">{t("contractReference")}</dt>
          <dd className="font-mono text-gray-900">{summary.contract_reference}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">{t("contractStatus")}</dt>
          <dd>{summary.contract_status}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">{t("escrowAmount")}</dt>
          <dd className="font-mono">{summary.escrow_amount} IQD</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">{t("totalPaid")}</dt>
          <dd className="font-mono">{summary.total_paid} IQD</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">{t("fundingStatus")}</dt>
          <dd>{summary.funding_status}</dd>
        </div>
      </dl>
      <SettlementBreakdown breakdown={summary.payment_breakdown} />
      {summary.settlement && (
        <div className="rounded-lg border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">{t("settlement")}</h3>
            <SettlementStatusBadge status={summary.settlement.status as any} />
          </div>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">{t("releasedPrincipal")}</dt>
              <dd className="font-mono">{summary.settlement.released_principal} IQD</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
