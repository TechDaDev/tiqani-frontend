"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FinancialChartCard } from "@/components/admin/financial/financial-chart-card";
import { FinancialSummaryCards } from "@/components/admin/financial/financial-summary-cards";
import { FinancialAuditTable } from "@/components/admin/financial/financial-audit-table";
import { FinancialPageShell, FinancialTabLink } from "@/components/admin/financial/financial-theme";
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
    <FinancialPageShell title={t("overview")} description={t("readOnly")} testId="admin-financial-overview">
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <FinancialTabLink key={link} href={`/${locale}/admin/financial/${link}`}>
            {t(link)}
          </FinancialTabLink>
        ))}
      </div>
      {error ? <p className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
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
            <h2 className="text-lg font-semibold text-foreground">{t("recentActivity")}</h2>
            <FinancialAuditTable items={data.recentActivity} locale={locale} />
          </section>
        </>
      ) : !error ? (
        <p className="text-sm text-foreground-muted">{t("loading")}</p>
      ) : null}
    </FinancialPageShell>
  );
}
