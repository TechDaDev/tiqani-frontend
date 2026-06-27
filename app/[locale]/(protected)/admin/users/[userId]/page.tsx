"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminReasonDialog } from "@/components/admin/admin-reason-dialog";
import { fetchAdminUser, restoreAdminUser, suspendAdminUser } from "@/lib/admin/api";
import type { AdminUser } from "@/lib/admin/types";

export default function AdminUserDetailPage() {
  const params = useParams<{ userId: string }>();
  const [user, setUser] = useState<AdminUser | null>(null);

  const load = useCallback(async () => {
    setUser(await fetchAdminUser(params.userId));
  }, [params.userId]);

  useEffect(() => {
    load().catch(() => setUser(null));
  }, [load]);

  if (!user) return <p className="p-4 text-sm text-foreground-muted">Loading...</p>;

  return (
    <div className="space-y-5" data-testid="admin-user-detail-page">
      <h1 className="text-2xl font-semibold">{user.username}</h1>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <dt className="text-sm text-foreground-muted">Email</dt>
          <dd className="mt-1 font-medium">{user.email}</dd>
        </div>
        <div className="rounded-lg border border-border p-4">
          <dt className="text-sm text-foreground-muted">Role</dt>
          <dd className="mt-1 font-medium">{user.roleDisplay || user.role}</dd>
        </div>
        <div className="rounded-lg border border-border p-4">
          <dt className="text-sm text-foreground-muted">Status</dt>
          <dd className="mt-1 font-medium">{user.isActive ? "Active" : "Suspended"}</dd>
        </div>
      </dl>
      {user.isActive ? (
        <AdminReasonDialog
          label="Suspend"
          title={`Suspend ${user.username}`}
          confirmLabel="Suspend"
          variant="danger"
          onConfirm={(reason) => suspendAdminUser(user.id, reason).then(load)}
        />
      ) : (
        <AdminReasonDialog
          label="Restore"
          title={`Restore ${user.username}`}
          confirmLabel="Restore"
          onConfirm={(reason) => restoreAdminUser(user.id, reason).then(load)}
        />
      )}
    </div>
  );
}
