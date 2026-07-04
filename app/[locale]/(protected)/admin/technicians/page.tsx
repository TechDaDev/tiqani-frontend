"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AdminReasonDialog } from "@/components/admin/admin-reason-dialog";
import { fetchAdminTechnicians, suspendTechnician } from "@/lib/admin/api";
import type { AdminTechnician } from "@/lib/admin/types";

function Badge({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${ok ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}>
      {children}
    </span>
  );
}

export default function AdminTechniciansPage() {
  const params = useParams<{ locale: string }>();
  const t = useTranslations("admin.technicians");
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
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-start">{t("technician")}</th>
              <th className="p-3 text-start">{t("job")}</th>
              <th className="p-3 text-start">{t("profile")}</th>
              <th className="p-3 text-start">{t("documents")}</th>
              <th className="p-3 text-start">{t("links")}</th>
              <th className="p-3 text-start">{t("approval")}</th>
              <th className="p-3 text-start">{t("actions")}</th>
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
                  <Badge ok={tech.isComplete}>{tech.isComplete ? t("complete") : t("incomplete")}</Badge>
                </td>
                <td className="p-3">
                  <Badge ok={tech.hasDocuments}>{tech.hasDocuments ? t("uploaded") : t("missing")}</Badge>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge ok={tech.hasGithub}>{t("github")}</Badge>
                    <Badge ok={tech.hasLinkedin}>{t("linkedin")}</Badge>
                  </div>
                </td>
                <td className="p-3">{tech.approved ? t("approved") : t("pending")}</td>
                <td className="flex flex-wrap gap-2 p-3">
                  <Link
                    href={`/${params.locale}/admin/technicians/${tech.id}`}
                    className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    {t("reviewAction")}
                  </Link>
                  {tech.approved ? (
                    <AdminReasonDialog
                      label={t("suspend")}
                      title={t("suspendConfirm", { name: tech.username })}
                      confirmLabel={t("suspend")}
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
