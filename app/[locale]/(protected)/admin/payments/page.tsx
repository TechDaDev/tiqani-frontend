"use client";

import Link from "next/link";

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-3" data-testid="admin-payments-page">
      <h1 className="text-2xl font-semibold">Payments</h1>
      <p className="text-sm text-foreground-muted">Payment, refund, withdrawal, and chargeback oversight is split across existing finance screens.</p>
      <div className="flex gap-3 text-sm">
        <Link className="text-blue-600 hover:underline" href="/admin/withdrawals">Withdrawals</Link>
        <Link className="text-blue-600 hover:underline" href="/admin/chargebacks">Chargebacks</Link>
      </div>
    </div>
  );
}
