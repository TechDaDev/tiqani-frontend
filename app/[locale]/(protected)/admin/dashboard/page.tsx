"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AdminBarChart } from "@/components/admin/charts/admin-bar-chart";
import { AdminDonutChart } from "@/components/admin/charts/admin-donut-chart";
import { AdminProgressChart } from "@/components/admin/charts/admin-progress-chart";
import { fetchAdminDashboard } from "@/lib/admin/api";
import { buildAdminDashboardCharts } from "@/lib/admin/dashboard-charts";
import type { AdminDashboard } from "@/lib/admin/types";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-sm text-foreground-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const t = useTranslations("admin.dashboard");
  const chartT = useTranslations("admin.dashboard.charts");
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminDashboard().then(setData).catch(() => setError(t("error")));
  }, [t]);

  if (error) return <p className="rounded-lg border border-red-200 p-4 text-sm text-red-700">{error}</p>;
  if (!data) return <p className="p-4 text-sm text-foreground-muted">{t("loading")}</p>;

  const charts = buildAdminDashboardCharts(data, {
    clients: chartT("clients"),
    technicians: chartT("technicians"),
    staff: chartT("staff"),
    dealerships: chartT("dealerships"),
    active: chartT("active"),
    inactive: chartT("inactive"),
    pending: chartT("pending"),
    approved: chartT("approved"),
    suspended: chartT("suspended"),
    contracts: chartT("contracts"),
    pendingPayments: chartT("pendingPayments"),
    pendingWithdrawals: chartT("pendingWithdrawals"),
    reviews: chartT("reviews"),
    unreadNotifications: chartT("unreadNotifications"),
  });

  return (
    <div className="space-y-6" data-testid="admin-dashboard-page">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label={t("stats.users")} value={data.users.total ?? 0} />
        <Stat label={t("stats.activeUsers")} value={data.users.active ?? 0} />
        <Stat label={t("stats.techniciansPending")} value={data.technicians.pending ?? 0} />
        <Stat label={t("stats.contracts")} value={data.contracts.total ?? 0} />
        <Stat label={t("stats.pendingPayments")} value={data.finance.payment_intents_pending ?? 0} />
        <Stat label={t("stats.pendingWithdrawals")} value={data.finance.withdrawals_pending ?? 0} />
        <Stat label={t("stats.reviews")} value={data.reviews.total ?? 0} />
        <Stat label={t("stats.unreadNotifications")} value={data.notifications.unread ?? 0} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2" data-testid="admin-dashboard-charts">
        <AdminDonutChart
          title={chartT("usersByRole.title")}
          description={chartT("usersByRole.description")}
          items={charts.usersByRole}
          total={charts.totals.users}
          totalLabel={chartT("total")}
          emptyLabel={chartT("noData")}
        />
        <AdminProgressChart
          title={chartT("userActivity.title")}
          description={chartT("userActivity.description")}
          items={charts.userActivity}
          total={charts.totals.activity}
          totalLabel={chartT("total")}
          emptyLabel={chartT("noData")}
        />
        <AdminBarChart
          title={chartT("technicianApproval.title")}
          description={chartT("technicianApproval.description")}
          items={charts.technicianApproval}
          total={charts.totals.technicians}
          totalLabel={chartT("total")}
          emptyLabel={chartT("noData")}
        />
        <AdminBarChart
          title={chartT("platformWorkflow.title")}
          description={chartT("platformWorkflow.description")}
          items={charts.platformWorkflow}
          total={charts.totals.workflow}
          totalLabel={chartT("total")}
          emptyLabel={chartT("noData")}
        />
      </div>
    </div>
  );
}
