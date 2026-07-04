"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FinancialChartCard } from "@/components/admin/financial/financial-chart-card";
import { FinancialSummaryCards } from "@/components/admin/financial/financial-summary-cards";
import { FinancialAuditTable } from "@/components/admin/financial/financial-audit-table";
import { fetchFinancialOverview } from "@/lib/api/admin-financial";
import type { AdminFinancialOverview } from "@/lib/admin/financial/types";

export default function AdminFinancialOverviewPage() {
  const t = useTranslations("admin.financial");
  const params = useParams<{ locale: string }>();
  const locale = params.locale || "en";
  const [data, setData] = useState<AdminFinancialOverview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFinancialOverview().then(setData).catch(() => setError(t("unavailable")));
  }, [t]);

  const links = ["payments", "refunds", "withdrawals", "ledger", "escrow", "audit"];

  return (
    <div className="space-y-6" data-testid="admin-financial-overview">
      <div>
        <h1 className="text-2xl font-semibold text-gray-950">{t("overview")}</h1>
        <p className="text-sm text-gray-500">{t("readOnly")}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link key={link} href={`/${locale}/admin/financial/${link}`} className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200">
            {t(link)}
          </Link>
        ))}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {data ? (
        <>
          <FinancialSummaryCards
            locale={locale}
            items={[
              { label: t("grossPayments"), amount: data.summary.grossPayments },
              { label: t("netPlatformFees"), amount: data.summary.netPlatformFees },
              { label: t("pendingWithdrawals"), amount: data.summary.pendingWithdrawals },
              { label: t("refundsIssued"), amount: data.summary.refundsIssued },
              { label: t("escrowHeld"), amount: data.summary.escrowHeld },
              { label: t("openLiabilities"), amount: data.summary.openLiabilities },
              { label: t("walletBalanceTotal"), amount: data.summary.walletBalanceTotal },
              { label: t("completedWithdrawals"), amount: data.summary.completedWithdrawals },
            ]}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <FinancialChartCard title={t("paymentsByStatus")} items={data.charts.paymentsByStatus} />
            <FinancialChartCard title={t("withdrawalsByStatus")} items={data.charts.withdrawalsByStatus} />
            <FinancialChartCard title={t("refundsByReason")} items={data.charts.refundsByReason} />
            <FinancialChartCard title={t("ledgerByType")} items={data.charts.ledgerByType} />
          </div>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950">{t("recentActivity")}</h2>
            <FinancialAuditTable items={data.recentActivity} locale={locale} />
          </section>
        </>
      ) : !error ? (
        <p className="text-sm text-gray-500">{t("loading")}</p>
      ) : null}
    </div>
  );
}
