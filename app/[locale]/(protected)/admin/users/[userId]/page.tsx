"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminReasonDialog } from "@/components/admin/admin-reason-dialog";
import { fetchAdminUser, restoreAdminUser, suspendAdminUser } from "@/lib/admin/api";
import type { AdminUser } from "@/lib/admin/types";

function Field({ label, value }: { label: string; value?: string | number | boolean }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <dt className="text-sm text-foreground-muted">{label}</dt>
      <dd className="mt-1 break-words font-medium">{value === "" || value == null ? "-" : String(value)}</dd>
    </div>
  );
}

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
        <Field label="ID" value={user.id} />
        <Field label="Email" value={user.email} />
        <Field label="Role" value={user.roleDisplay || user.role} />
        <Field label="Status" value={user.isActive ? "Active" : "Suspended"} />
        <Field label="Full Name" value={[user.firstName, user.lastName].filter(Boolean).join(" ")} />
        <Field label="Phone" value={user.phoneNumber} />
        <Field label="Governorate" value={user.governorate} />
        <Field label="Address" value={user.address} />
        <Field label="Gender" value={user.gender} />
        <Field label="Date of Birth" value={user.dateOfBirth} />
        <Field label="Staff" value={user.isStaff ? "Yes" : "No"} />
        <Field label="Superuser" value={user.isSuperuser ? "Yes" : "No"} />
        <Field label="Joined" value={user.dateJoined} />
        <Field label="Last Login" value={user.lastLogin} />
      </dl>
      <section className="rounded-lg border border-border p-4">
        <h2 className="text-sm font-semibold">Profiles</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Client Profile" value={user.profiles.client.exists ? (user.profiles.client.isComplete ? "Complete" : "Incomplete") : "Not created"} />
          <Field label="Technician Profile" value={user.profiles.technician.exists ? (user.profiles.technician.approved ? "Approved" : "Pending or incomplete") : "Not created"} />
          <Field label="Technician Job" value={user.profiles.technician.jobTitle} />
          <Field label="Technician Missing Fields" value={user.profiles.technician.missingFields.join(", ")} />
        </div>
      </section>
      <section className="rounded-lg border border-border p-4">
        <h2 className="text-sm font-semibold">Activity</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {Object.entries(user.activity).map(([key, value]) => (
            <Field key={key} label={key.replaceAll("_", " ")} value={value} />
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-border p-4">
        <h2 className="text-sm font-semibold">Financial Summary</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="Wallet" value={user.financialSummary.walletExists ? "Exists" : "Not created"} />
          <Field label="Wallet Balance" value={user.financialSummary.walletBalance} />
          <Field label="Payment Intents" value={user.financialSummary.paymentIntents} />
          <Field label="Withdrawals" value={user.financialSummary.withdrawals} />
        </div>
      </section>
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
