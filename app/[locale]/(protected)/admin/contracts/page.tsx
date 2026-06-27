"use client";

import Link from "next/link";

export default function AdminContractsPage() {
  return (
    <div className="space-y-3" data-testid="admin-contracts-page">
      <h1 className="text-2xl font-semibold">Contracts</h1>
      <p className="text-sm text-foreground-muted">Contract oversight remains available through dispute and payment detail workflows for this checkpoint.</p>
      <Link className="text-sm text-blue-600 hover:underline" href="/admin/disputes">
        Open dispute oversight
      </Link>
    </div>
  );
}
