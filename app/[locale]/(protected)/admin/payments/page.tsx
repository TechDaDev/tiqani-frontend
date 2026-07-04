"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminPaymentsPage() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale || "en";

  return (
    <div className="space-y-3" data-testid="admin-payments-page">
      <h1 className="text-2xl font-semibold">Payments</h1>
      <p className="text-sm text-foreground-muted">Payment, refund, withdrawal, ledger, and escrow oversight now lives in Financial.</p>
      <div className="flex gap-3 text-sm">
        <Link className="text-blue-600 hover:underline" href={`/${locale}/admin/financial`}>Financial overview</Link>
        <Link className="text-blue-600 hover:underline" href={`/${locale}/admin/financial/payments`}>Payments</Link>
        <Link className="text-blue-600 hover:underline" href={`/${locale}/admin/financial/withdrawals`}>Withdrawals</Link>
      </div>
    </div>
  );
}
