import type { AdminDashboard } from "./types";

type ChartLabels = {
  clients: string;
  technicians: string;
  staff: string;
  dealerships: string;
  active: string;
  inactive: string;
  pending: string;
  approved: string;
  suspended: string;
  contracts: string;
  pendingPayments: string;
  pendingWithdrawals: string;
  reviews: string;
  unreadNotifications: string;
};

function toNumber(value: string | number | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function buildAdminDashboardCharts(data: AdminDashboard, labels: ChartLabels) {
  const totalUsers = toNumber(data.users.total);
  const activeUsers = toNumber(data.users.active);
  const inactiveUsers = Math.max(totalUsers - activeUsers, 0);
  const dealerships = toNumber(data.users.dealerships);
  const technicianTotal = toNumber(data.technicians.total);
  const technicianPending = toNumber(data.technicians.pending);
  const technicianApproved = toNumber(data.technicians.approved);
  const technicianSuspended = toNumber(data.technicians.suspended) + toNumber(data.technicians.rejected);

  return {
    usersByRole: [
      { label: labels.clients, value: toNumber(data.users.clients), color: "#14b8a6" },
      { label: labels.technicians, value: toNumber(data.users.technicians), color: "#38bdf8" },
      { label: labels.staff, value: toNumber(data.users.admins), color: "#a78bfa" },
      ...(dealerships > 0 ? [{ label: labels.dealerships, value: dealerships, color: "#f59e0b" }] : []),
    ],
    userActivity: [
      { label: labels.active, value: activeUsers, className: "bg-primary" },
      { label: labels.inactive, value: inactiveUsers, className: "bg-slate-500" },
    ],
    technicianApproval: [
      { label: labels.pending, value: technicianPending, color: "#f59e0b" },
      { label: labels.approved, value: technicianApproved, color: "#14b8a6" },
      ...(technicianSuspended > 0 ? [{ label: labels.suspended, value: technicianSuspended, color: "#94a3b8" }] : []),
    ],
    platformWorkflow: [
      { label: labels.contracts, value: toNumber(data.contracts.total), color: "#38bdf8" },
      { label: labels.pendingPayments, value: toNumber(data.finance.payment_intents_pending), color: "#f59e0b" },
      { label: labels.pendingWithdrawals, value: toNumber(data.finance.withdrawals_pending), color: "#a78bfa" },
      { label: labels.reviews, value: toNumber(data.reviews.total), color: "#14b8a6" },
      { label: labels.unreadNotifications, value: toNumber(data.notifications.unread), color: "#94a3b8" },
    ],
    totals: {
      users: totalUsers,
      activity: totalUsers,
      technicians: technicianTotal,
      workflow:
        toNumber(data.contracts.total) +
        toNumber(data.finance.payment_intents_pending) +
        toNumber(data.finance.withdrawals_pending) +
        toNumber(data.reviews.total) +
        toNumber(data.notifications.unread),
    },
  };
}
