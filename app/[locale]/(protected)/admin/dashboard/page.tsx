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
    </div>
  );
}
