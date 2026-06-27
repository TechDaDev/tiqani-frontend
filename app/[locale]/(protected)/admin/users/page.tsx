"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminReasonDialog } from "@/components/admin/admin-reason-dialog";
import { fetchAdminUsers, restoreAdminUser, suspendAdminUser } from "@/lib/admin/api";
import type { AdminUser } from "@/lib/admin/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async (search = "") => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    const data = await fetchAdminUsers(params.toString());
    setUsers(data.results);
  }, []);

  useEffect(() => {
    load().catch(() => setError("Users unavailable."));
  }, [load]);

  return (
    <div className="space-y-5" data-testid="admin-users-page">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-foreground-muted">Safe account status controls.</p>
        </div>
        <form
          className="ml-auto flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            load(query).catch(() => setError("Search failed."));
          }}
        >
          <input
            aria-label="Search users"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <button className="rounded-md bg-primary px-3 py-2 text-sm text-white">Search</button>
        </form>
      </div>
      {error && <p className="rounded-lg border border-red-200 p-3 text-sm text-red-700">{error}</p>}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-start">User</th>
              <th className="p-3 text-start">Role</th>
              <th className="p-3 text-start">Status</th>
              <th className="p-3 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-border">
                <td className="p-3">
                  <Link href={`/admin/users/${user.id}`} className="font-medium text-blue-600 hover:underline">
                    {user.username}
                  </Link>
                  <div className="text-foreground-muted">{user.email}</div>
                </td>
                <td className="p-3">{user.roleDisplay || user.role}</td>
                <td className="p-3">{user.isActive ? "Active" : "Suspended"}</td>
                <td className="p-3">
                  {user.isActive ? (
                    <AdminReasonDialog
                      label="Suspend"
                      title={`Suspend ${user.username}`}
                      confirmLabel="Suspend"
                      variant="danger"
                      onConfirm={(reason) => suspendAdminUser(user.id, reason).then(() => load(query))}
                    />
                  ) : (
                    <AdminReasonDialog
                      label="Restore"
                      title={`Restore ${user.username}`}
                      confirmLabel="Restore"
                      onConfirm={(reason) => restoreAdminUser(user.id, reason).then(() => load(query))}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
