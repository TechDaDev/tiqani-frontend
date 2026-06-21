"use client";

import { useTranslations } from "next-intl";
import { SettlementStatusBadge } from "./settlement-status-badge";
import type { Settlement } from "@/lib/settlement/types";

interface Props {
  settlement: Settlement;
}

export function SettlementReceipt({ settlement }: Props) {
  const t = useTranslations("settlement");

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4" role="region" aria-label={t("settlementReceipt")}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-green-800">{t("settlementReceipt")}</h3>
        <SettlementStatusBadge status={settlement.status} />
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-green-700">{t("releasedPrincipal")}</dt>
          <dd className="font-mono text-green-900">{settlement.released_principal} {settlement.currency}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-green-700">{t("technicianNet")}</dt>
          <dd className="font-mono text-green-900">{settlement.technician_net_amount} {settlement.currency}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-green-700">{t("technicianCommission")}</dt>
          <dd className="font-mono text-green-900">{settlement.technician_commission_amount} {settlement.currency}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-green-700">{t("clientServiceFee")}</dt>
          <dd className="font-mono text-green-900">{settlement.client_service_fee_amount} {settlement.currency}</dd>
        </div>
        {settlement.completed_at && (
          <div className="flex justify-between">
            <dt className="text-green-700">{t("completedAt")}</dt>
            <dd className="text-green-900">{new Date(settlement.completed_at).toLocaleString()}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
