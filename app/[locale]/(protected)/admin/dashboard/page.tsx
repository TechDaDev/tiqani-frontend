"use client";

import { useEffect, useState } from "react";
import { fetchAdminDashboard } from "@/lib/admin/api";
import type { AdminDashboard } from "@/lib/admin/types";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-sm text-foreground-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function BarChart({ title, items }: { title: string; items: Array<{ label: string; value: number }> }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="grid grid-cols-[132px_1fr_44px] items-center gap-3 text-sm">
            <span className="truncate text-foreground-muted">{item.label}</span>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max((item.value / max) * 100, item.value > 0 ? 8 : 0)}%` }}
              />
            </div>
            <span className="text-end font-medium tabular-nums">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RatioChart({ title, value, total, label }: { title: string; value: number; total: number; label: string }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-4 flex items-end gap-4">
        <div
          className="grid h-28 w-28 place-items-center rounded-full"
          style={{
            background: `conic-gradient(var(--primary) ${percent * 3.6}deg, var(--muted) 0deg)`,
          }}
        >
          <div className="grid h-20 w-20 place-items-center rounded-full bg-card text-xl font-semibold">
            {percent}%
          </div>
        </div>
        <div className="pb-2 text-sm text-foreground-muted">
          <div className="font-medium text-foreground">{label}</div>
          <div className="mt-1 tabular-nums">{value} of {total}</div>
        </div>
      </div>
    </section>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminDashboard().then(setData).catch(() => setError("Admin dashboard unavailable."));
  }, []);

  if (error) return <p className="rounded-lg border border-red-200 p-4 text-sm text-red-700">{error}</p>;
  if (!data) return <p className="p-4 text-sm text-foreground-muted">Loading...</p>;

  return (
    <div className="space-y-6" data-testid="admin-dashboard-page">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Users" value={data.users.total ?? 0} />
        <Stat label="Active Users" value={data.users.active ?? 0} />
        <Stat label="Technicians Pending" value={data.technicians.pending ?? 0} />
        <Stat label="Contracts" value={data.contracts.total ?? 0} />
        <Stat label="Pending Payments" value={data.finance.payment_intents_pending ?? 0} />
        <Stat label="Pending Withdrawals" value={data.finance.withdrawals_pending ?? 0} />
        <Stat label="Reviews" value={data.reviews.total ?? 0} />
        <Stat label="Unread Notifications" value={data.notifications.unread ?? 0} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <BarChart
          title="Users by Role"
          items={[
            { label: "Clients", value: data.users.clients ?? 0 },
            { label: "Technicians", value: data.users.technicians ?? 0 },
            { label: "Dealerships", value: data.users.dealerships ?? 0 },
            { label: "Admins", value: data.users.admins ?? 0 },
          ]}
        />
        <BarChart
          title="Contracts by Status"
          items={[
            { label: "Draft", value: data.contracts.draft ?? 0 },
            { label: "Pending", value: data.contracts.pending_acceptance ?? 0 },
            { label: "In Progress", value: data.contracts.in_progress ?? 0 },
            { label: "Completed", value: data.contracts.completed ?? 0 },
            { label: "Canceled", value: data.contracts.canceled ?? 0 },
          ]}
        />
        <RatioChart
          title="Technician Approval"
          value={data.technicians.approved ?? 0}
          total={data.technicians.total ?? 0}
          label="Approved technicians"
        />
        <RatioChart
          title="Review Quality"
          value={data.reviews.verified ?? 0}
          total={data.reviews.total ?? 0}
          label="Verified reviews"
        />
      </div>
    </div>
  );
}
