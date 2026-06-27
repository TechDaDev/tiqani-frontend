"use client";

import { useEffect, useState } from "react";
import { fetchPlatformHealth } from "@/lib/admin/api";
import type { PlatformHealth } from "@/lib/admin/types";

export default function AdminSystemPage() {
  const [health, setHealth] = useState<PlatformHealth | null>(null);

  useEffect(() => {
    fetchPlatformHealth().then(setHealth).catch(() => setHealth(null));
  }, []);

  return (
    <div className="space-y-5" data-testid="admin-system-page">
      <h1 className="text-2xl font-semibold">System</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border p-4">
          <div className="text-sm text-foreground-muted">Status</div>
          <div className="mt-2 text-xl font-semibold">{health?.status || "unknown"}</div>
        </div>
        <div className="rounded-lg border border-border p-4">
          <div className="text-sm text-foreground-muted">Database</div>
          <div className="mt-2 text-xl font-semibold">{health?.database || "unknown"}</div>
        </div>
        <div className="rounded-lg border border-border p-4">
          <div className="text-sm text-foreground-muted">Redis</div>
          <div className="mt-2 text-xl font-semibold">{health?.redis || "unknown"}</div>
        </div>
        <div className="rounded-lg border border-border p-4">
          <div className="text-sm text-foreground-muted">Version</div>
          <div className="mt-2 text-xl font-semibold">{health?.version || "unset"}</div>
        </div>
      </div>
    </div>
  );
}
