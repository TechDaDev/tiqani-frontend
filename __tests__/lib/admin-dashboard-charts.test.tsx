import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminBarChart } from "@/components/admin/charts/admin-bar-chart";
import { buildAdminDashboardCharts } from "@/lib/admin/dashboard-charts";
import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";
import kuMessages from "@/messages/ku.json";

const labels = {
  clients: "Clients",
  technicians: "Technicians",
  staff: "Staff",
  dealerships: "Dealerships",
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  approved: "Approved",
  suspended: "Suspended",
  contracts: "Contracts",
  pendingPayments: "Pending payments",
  pendingWithdrawals: "Pending withdrawals",
  reviews: "Reviews",
  unreadNotifications: "Unread notifications",
};

describe("admin dashboard charts", () => {
  it("builds chart items from dashboard aggregates", () => {
    const charts = buildAdminDashboardCharts({
      users: { total: 5, active: 3, clients: 2, technicians: 1, admins: 1, dealerships: 1 },
      technicians: { total: 2, pending: 1, approved: 1 },
      contracts: { total: 4 },
      finance: { payment_intents_pending: "2", withdrawals_pending: "1" },
      reviews: { total: 6 },
      notifications: { unread: 7 },
    }, labels);

    expect(charts.usersByRole.map((item) => item.value)).toEqual([2, 1, 1, 1]);
    expect(charts.userActivity[1].value).toBe(2);
    expect(charts.totals.workflow).toBe(20);
  });

  it("handles zero and empty dashboard data", () => {
    const charts = buildAdminDashboardCharts({
      users: {},
      technicians: {},
      contracts: {},
      finance: {},
      reviews: {},
      notifications: {},
    }, labels);

    expect(charts.totals.users).toBe(0);
    expect(charts.userActivity).toEqual([
      expect.objectContaining({ label: "Active", value: 0 }),
      expect.objectContaining({ label: "Inactive", value: 0 }),
    ]);
    expect(charts.platformWorkflow.every((item) => item.value === 0)).toBe(true);
  });

  it("renders accessible chart labels and empty state", () => {
    render(
      <AdminBarChart
        title="Workflow"
        items={[{ label: "Contracts", value: 0 }]}
        emptyLabel="No data yet"
      />
    );

    expect(screen.getByRole("heading", { name: "Workflow" })).toBeVisible();
    expect(screen.getByText("No data yet")).toBeVisible();
  });

  it("has localized chart keys in supported locales", () => {
    for (const messages of [enMessages, arMessages, kuMessages]) {
      expect(messages.admin.dashboard.charts.usersByRole.title).toBeTruthy();
      expect(messages.admin.dashboard.charts.userActivity.title).toBeTruthy();
      expect(messages.admin.dashboard.charts.technicianApproval.title).toBeTruthy();
      expect(messages.admin.dashboard.charts.platformWorkflow.title).toBeTruthy();
      expect(messages.admin.dashboard.charts.noData).toBeTruthy();
    }
  });
});
