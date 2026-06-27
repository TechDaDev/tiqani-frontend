"use client";

import { useEffect, useState } from "react";
import { AdminReasonDialog } from "@/components/admin/admin-reason-dialog";
import { approveTechnician, fetchAdminTechnicians, suspendTechnician } from "@/lib/admin/api";
import type { AdminTechnician } from "@/lib/admin/types";

export default function AdminTechniciansPage() {
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
                <td className="p-3">{tech.approved ? "Approved" : "Pending"}</td>
                <td className="p-3">
                  {tech.approved ? (
                    <AdminReasonDialog
                      label="Suspend"
                      title={`Suspend ${tech.username}`}
                      confirmLabel="Suspend"
                      variant="danger"
                      onConfirm={(reason) => suspendTechnician(tech.id, reason).then(load)}
                    />
                  ) : (
                    <AdminReasonDialog
                      label="Approve"
                      title={`Approve ${tech.username}`}
                      confirmLabel="Approve"
                      onConfirm={(reason) => approveTechnician(tech.id, reason).then(load)}
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
