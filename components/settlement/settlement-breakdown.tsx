"use client";

import { useTranslations } from "next-intl";
import type { PaymentBreakdown } from "@/lib/settlement/types";

interface Props {
  breakdown: PaymentBreakdown;
  currency?: string;
}

export function SettlementBreakdown({ breakdown, currency = "IQD" }: Props) {
  const t = useTranslations("settlement");

  const rows = [
    { label: t("contractAmount"), value: breakdown.contract_amount },
    { label: t("technicianCommission"), value: breakdown.technician_commission_amount },
    { label: t("clientServiceFee"), value: breakdown.client_service_fee_amount },
    { label: t("totalPlatformFee"), value: breakdown.total_platform_fee },
    { label: t("technicianNet"), value: breakdown.technician_net_amount, bold: true },
    { label: t("clientTotal"), value: breakdown.client_total_amount },
  ];

  return (
    <div className="space-y-2 rounded-lg border p-4" role="region" aria-label={t("financialBreakdown")}>
      <h3 className="text-sm font-semibold text-gray-900">{t("financialBreakdown")}</h3>
      <dl className="divide-y divide-gray-100">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between py-1.5 text-sm">
            <dt className="text-gray-600">{row.label}</dt>
            <dd
              className={`font-mono ${row.bold ? "font-semibold text-gray-900" : "text-gray-700"}`}
            >
              {row.value} {currency}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
