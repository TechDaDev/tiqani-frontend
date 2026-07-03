"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminReasonDialog } from "@/components/admin/admin-reason-dialog";
import { fetchAdminTechnicians, suspendTechnician } from "@/lib/admin/api";
import type { AdminTechnician } from "@/lib/admin/types";

export default function AdminTechniciansPage() {
  const params = useParams<{ locale: string }>();
  const [technicians, setTechnicians] = useState<AdminTechnician[]>([]);

  async function load() {
    const data = await fetchAdminTechnicians();
    setTechnicians(data.results);
  }

  useEffect(() => {
    load().catch(() => setTechnicians([]));
  }, []);

  return (
    <div className="space-y-5" data-testid="admin-technicians-page">
      <h1 className="text-2xl font-semibold">Technicians</h1>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-start">Technician</th>
              <th className="p-3 text-start">Job</th>
              <th className="p-3 text-start">Profile</th>
              <th className="p-3 text-start">Approval</th>
              <th className="p-3 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {technicians.map((tech) => (
              <tr key={tech.id} className="border-t border-border">
                <td className="p-3">
                  <div className="font-medium">{tech.username}</div>
                  <div className="text-foreground-muted">{tech.email}</div>
                </td>
                <td className="p-3">{tech.jobTitle || "-"}</td>
                <td className="p-3">
                  {tech.isComplete ? (
                    <span className="text-green-600">Complete</span>
                  ) : (
                    <span className="text-amber-600">Missing {tech.incompleteFields.length || "fields"}</span>
                  )}
                </td>
                <td className="p-3">{tech.approved ? "Approved" : "Pending"}</td>
                <td className="flex flex-wrap gap-2 p-3">
                  <Link
                    href={`/${params.locale}/admin/technicians/${tech.id}`}
                    className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    Review
                  </Link>
                  {tech.approved ? (
                    <AdminReasonDialog
                      label="Suspend"
                      title={`Suspend ${tech.username}`}
                      confirmLabel="Suspend"
                      variant="danger"
                      onConfirm={(reason) => suspendTechnician(tech.id, reason).then(load)}
                    />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
