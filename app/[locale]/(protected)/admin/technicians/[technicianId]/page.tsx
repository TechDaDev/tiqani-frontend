"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminReasonDialog } from "@/components/admin/admin-reason-dialog";
import { Button } from "@/components/ui/button";
import { approveTechnician, fetchAdminTechnician, suspendTechnician } from "@/lib/admin/api";
import type { AdminTechnicianDetail } from "@/lib/admin/types";

function Field({ label, value, href }: { label: string; value?: string | number | boolean; href?: string }) {
  const display = value === "" || value == null ? "-" : String(value);
  return (
    <div className="rounded-lg border border-border p-4">
      <dt className="text-sm text-foreground-muted">{label}</dt>
      <dd className="mt-1 break-words font-medium">
        {href && value ? (
          <a className="text-blue-600 hover:underline" href={href} target="_blank" rel="noreferrer">
            {display}
          </a>
        ) : display}
      </dd>
    </div>
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

export default function AdminTechnicianDetailPage() {
  const params = useParams<{ locale: string; technicianId: string }>();
  const [technician, setTechnician] = useState<AdminTechnicianDetail | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setTechnician(await fetchAdminTechnician(params.technicianId));
  }, [params.technicianId]);

  useEffect(() => {
    load().catch(() => setError("Technician details unavailable."));
  }, [load]);

  if (error) return <p className="rounded-lg border border-red-200 p-4 text-sm text-red-700">{error}</p>;
  if (!technician) return <p className="p-4 text-sm text-foreground-muted">Loading...</p>;

  const missing = technician.incompleteFields.length ? technician.incompleteFields.join(", ") : "-";
  const approvalMissing = technician.approvalRequirements.missing;

  return (
    <div className="space-y-5" data-testid="admin-technician-detail-page">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href={`/${params.locale}/admin/technicians`} className="text-sm text-blue-600 hover:underline">
            Back to technicians
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">{technician.username}</h1>
          <p className="text-sm text-foreground-muted">{technician.jobTitle || "No job title"}</p>
        </div>
        <div className="flex gap-2">
          {technician.approved ? (
            <AdminReasonDialog
              label="Suspend"
              title={`Suspend ${technician.username}`}
              confirmLabel="Suspend"
              variant="danger"
              onConfirm={(reason) => suspendTechnician(technician.id, reason).then(load)}
            />
          ) : technician.approvalRequirements.canApprove ? (
            <AdminReasonDialog
              label="Approve"
              title={`Approve ${technician.username}`}
              confirmLabel="Approve"
              onConfirm={(reason) => approveTechnician(technician.id, reason).then(load)}
            />
          ) : (
            <Button type="button" variant="outline" disabled>
              Approve
            </Button>
          )}
        </div>
      </div>

      {!technician.approved && (
        <section className="rounded-lg border border-border p-4">
          <h2 className="text-sm font-semibold">Approval Checklist</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Profile complete", technician.isComplete],
              ["Documents uploaded", technician.hasDocuments],
              ["GitHub URL", technician.hasGithub],
              ["LinkedIn URL", technician.hasLinkedin],
              ["Active account", !approvalMissing.includes("active_account")],
            ].map(([label, done]) => (
              <div key={String(label)} className="rounded-md border border-border px-3 py-2 text-sm">
                <span className={done ? "text-green-600" : "text-amber-600"}>
                  {done ? "Complete" : "Missing"}
                </span>
                <span className="ms-2">{label}</span>
              </div>
            ))}
          </div>
          {approvalMissing.length > 0 && (
            <p className="mt-3 text-sm text-foreground-muted">
              Missing requirements: {approvalMissing.join(", ")}
            </p>
          )}
        </section>
      )}

      <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Field label="Email" value={technician.email} />
        <Field label="Phone" value={technician.phoneNumber} />
        <Field label="Approval" value={technician.approved ? "Approved" : "Pending"} />
        <Field label="Profile Complete" value={technician.isComplete ? "Yes" : "No"} />
        <Field label="Missing Fields" value={missing} />
        <Field label="Available" value={technician.isAvailable ? "Yes" : "No"} />
        <Field label="Years of Expertise" value={technician.yearsOfExpertise} />
        <Field label="Rating" value={technician.rate} />
        <Field label="Governorate" value={technician.governorate} />
        <Field label="Address" value={technician.address} />
        <Field label="Gender" value={technician.gender} />
        <Field label="Date of Birth" value={technician.dateOfBirth} />
        <Field label="GitHub" value={technician.github} href={technician.github} />
        <Field label="LinkedIn" value={technician.linkedin} href={technician.linkedin} />
        <Field label="Identification Documents" value={technician.identificationDocuments} href={technician.identificationDocuments} />
        <Field label="Wallet ID" value={technician.walletId} />
        <Field label="Balance" value={technician.balance} />
        <Field label="Last Active" value={technician.lastActive} />
      </dl>

      <section className="rounded-lg border border-border p-4">
        <h2 className="text-sm font-semibold">About</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm text-foreground-muted">{technician.about || "-"}</p>
      </section>

      <div className="grid gap-3 xl:grid-cols-3">
        <ChipList title="Categories" items={technician.skillSets.categoriesDetail} />
        <ChipList title="Skills" items={technician.skillSets.skillsDetail} />
        <ChipList title="Sub-skills" items={technician.skillSets.subSkillsDetail} />
      </div>

      <section className="rounded-lg border border-border p-4">
        <h2 className="text-sm font-semibold">Portfolio Images</h2>
        {technician.images.length ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {technician.images.map((image) => (
              <a key={image.id} href={image.image} target="_blank" rel="noreferrer" className="rounded-md border border-border p-3 text-sm hover:bg-muted">
                <div className="font-medium">Open image</div>
                <div className="mt-1 text-foreground-muted">{image.description || image.image}</div>
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-foreground-muted">-</p>
        )}
      </section>
    </div>
  );
}
