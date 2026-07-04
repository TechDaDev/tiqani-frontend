"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AdminReasonDialog } from "@/components/admin/admin-reason-dialog";
import { Button } from "@/components/ui/button";
import { ApiClientError } from "@/lib/api/errors";
import { approveTechnician, fetchAdminTechnician, suspendTechnician } from "@/lib/admin/api";
import { getTechnicianApprovalReasonKey, technicianDocumentHref } from "@/lib/admin/technician-review";
import type { AdminTechnicianDetail } from "@/lib/admin/types";

function Field({ label, value, href }: { label: string; value?: string | number | boolean; href?: string }) {
  const display = value === "" || value == null ? "-" : String(value);
  return (
    <div className="rounded-lg border border-border p-4">
      <dt className="text-sm text-foreground-muted">{label}</dt>
      <dd className="mt-1 break-words font-medium">
        {href && value ? (
          <a className="text-blue-600 hover:underline" href={href} target="_blank" rel="noopener noreferrer">
            {display}
          </a>
        ) : display}
      </dd>
    </div>
  );
}

function StatusBadge({ ok, passLabel, failLabel }: { ok: boolean; passLabel: string; failLabel: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ok ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}>
      {ok ? passLabel : failLabel}
    </span>
  );
}

function ChipList({ title, items }: { title: string; items: Array<{ id: string | number; name: string }> }) {
  return (
    <section className="rounded-lg border border-border p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? items.map((item) => (
          <span key={String(item.id)} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {item.name}
          </span>
        )) : <span className="text-sm text-foreground-muted">-</span>}
      </div>
    </section>
  );
}

function formatBytes(size: number | null) {
  if (!size) return "-";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminTechnicianDetailPage() {
  const params = useParams<{ locale: string; technicianId: string }>();
  const t = useTranslations("admin.technicians");
  const reviewT = useTranslations("admin.technicians.review");
  const [technician, setTechnician] = useState<AdminTechnicianDetail | null>(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setTechnician(await fetchAdminTechnician(params.technicianId));
  }, [params.technicianId]);

  useEffect(() => {
    load().catch(() => setError(reviewT("loadFailed")));
  }, [load, reviewT]);

  if (error) return <p className="rounded-lg border border-red-200 p-4 text-sm text-red-700">{error}</p>;
  if (!technician) return <p className="p-4 text-sm text-foreground-muted">{reviewT("loading")}</p>;

  const fullName = [technician.user.firstName, technician.user.lastName].filter(Boolean).join(" ") || technician.username;
  const approvalReasonKey = getTechnicianApprovalReasonKey(technician);
  const approvalBlocked = Boolean(approvalReasonKey);

  async function approveWithReason(reason: string) {
    if (!technician) return;
    setActionError("");
    try {
      await approveTechnician(technician.id, reason);
      await load();
    } catch (error) {
      if (error instanceof ApiClientError && error.code === "TECHNICIAN_APPROVAL_REQUIREMENTS_MISSING") {
        setActionError(reviewT("approvalRequirementsMissing"));
        return;
      }
      setActionError(reviewT("actionFailed"));
    }
  }

  return (
    <div className="space-y-5" data-testid="admin-technician-detail-page">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href={`/${params.locale}/admin/technicians`} className="text-sm text-blue-600 hover:underline">
            {reviewT("back")}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">{reviewT("title", { name: fullName })}</h1>
          <p className="text-sm text-foreground-muted">{technician.jobTitle || reviewT("noJobTitle")}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            {technician.approved ? (
              <AdminReasonDialog
                label={reviewT("suspend")}
                title={reviewT("suspendConfirm", { name: fullName })}
                confirmLabel={reviewT("suspend")}
                variant="danger"
                onConfirm={(reason) => suspendTechnician(technician.id, reason).then(load)}
              />
            ) : technician.approvalRequirements.canApprove ? (
              <AdminReasonDialog
                label={reviewT("approve")}
                title={reviewT("approveConfirm", { name: fullName })}
                confirmLabel={reviewT("approve")}
                onConfirm={approveWithReason}
              />
            ) : (
              <Button type="button" variant="outline" disabled>
                {reviewT("approve")}
              </Button>
            )}
          </div>
          {approvalBlocked ? (
            <p className="max-w-sm text-end text-sm text-amber-600">{reviewT(approvalReasonKey)}</p>
          ) : (
            <p className="max-w-sm text-end text-sm text-green-600">{reviewT("canApprove")}</p>
          )}
          {actionError ? <p className="max-w-sm text-end text-sm text-red-600">{actionError}</p> : null}
        </div>
      </div>

      <section className="rounded-lg border border-border p-4">
        <h2 className="text-sm font-semibold">{reviewT("checklist")}</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {technician.approvalRequirements.checklist.map((item) => (
            <div key={item.key} className="rounded-md border border-border px-3 py-2 text-sm">
              <StatusBadge ok={item.passed} passLabel={reviewT("passed")} failLabel={reviewT("failed")} />
              <span className="ms-2">{reviewT(`checklistItems.${item.key}`)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">{reviewT("basicInfo")}</h2>
        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Field label={reviewT("fullName")} value={fullName} />
          <Field label={reviewT("email")} value={technician.email} />
          <Field label={reviewT("phone")} value={technician.phoneNumber} />
          <Field label={reviewT("accountStatus")} value={technician.user.isActive ? reviewT("active") : reviewT("inactive")} />
          <Field label={reviewT("joinedDate")} value={technician.user.dateJoined} />
          <Field label={reviewT("approvalStatus")} value={technician.approved ? t("approved") : t("pending")} />
          <Field label={reviewT("suspensionStatus")} value={technician.isAvailable ? reviewT("notSuspended") : reviewT("suspended")} />
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">{reviewT("professionalProfile")}</h2>
        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Field label={reviewT("jobTitle")} value={technician.jobTitle} />
          <Field label={reviewT("experience")} value={technician.yearsOfExpertise} />
          <Field label={reviewT("github")} value={technician.github || reviewT("missing")} href={technician.github} />
          <Field label={reviewT("linkedin")} value={technician.linkedin || reviewT("missing")} href={technician.linkedin} />
          <Field label={reviewT("profileComplete")} value={technician.isComplete ? reviewT("complete") : reviewT("incomplete")} />
        </dl>
        <section className="rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold">{reviewT("bio")}</h3>
          <p className="mt-3 whitespace-pre-wrap text-sm text-foreground-muted">{technician.about || "-"}</p>
        </section>
      </section>

      <div className="grid gap-3 xl:grid-cols-3">
        <ChipList title={reviewT("categories")} items={technician.skillSets.categoriesDetail} />
        <ChipList title={reviewT("skills")} items={technician.skillSets.skillsDetail} />
        <ChipList title={reviewT("subSkills")} items={technician.skillSets.subSkillsDetail} />
      </div>

      <section className="rounded-lg border border-border p-4">
        <h2 className="text-sm font-semibold">{reviewT("documents")}</h2>
        {technician.documents.length ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-start">{reviewT("documentName")}</th>
                  <th className="p-3 text-start">{reviewT("documentType")}</th>
                  <th className="p-3 text-start">{reviewT("documentStatus")}</th>
                  <th className="p-3 text-start">{reviewT("documentSize")}</th>
                  <th className="p-3 text-start">{reviewT("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {technician.documents.map((document) => (
                  <tr key={document.id} className="border-t border-border">
                    <td className="p-3 font-medium">{document.name}</td>
                    <td className="p-3 text-foreground-muted">{document.type || "-"}</td>
                    <td className="p-3">{document.status || reviewT("uploaded")}</td>
                    <td className="p-3 tabular-nums">{formatBytes(document.size)}</td>
                    <td className="p-3">
                      <a
                        className="text-blue-600 hover:underline"
                        href={technicianDocumentHref(technician.id, document.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {reviewT("downloadDocument")}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-foreground-muted">{reviewT("noDocuments")}</p>
        )}
      </section>
    </div>
  );
}
