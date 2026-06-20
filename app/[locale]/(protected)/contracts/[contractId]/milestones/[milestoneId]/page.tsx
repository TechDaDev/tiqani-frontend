"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { browserRequest } from "@/lib/api/browser-client";
import { useAuth } from "@/components/auth/auth-provider";
import { isClient } from "@/lib/auth/guards";
import { MilestoneStatusBadge } from "@/components/milestones/milestone-status-badge";
import { DeliverableList } from "@/components/deliverables/deliverable-list";
import { DeliverableForm } from "@/components/deliverables/deliverable-form";
import { RevisionRequestForm } from "@/components/deliverables/revision-request-form";
import { RevisionHistory } from "@/components/deliverables/revision-history";
import { MILESTONE_STATUS } from "@/lib/milestones/types";
import type { MilestoneDetail } from "@/lib/milestones/types";

export default function MilestoneDetailPage() {
  const params = useParams();
  const milestoneId = params.milestoneId as string;
  const t = useTranslations("milestones");
  const td = useTranslations("deliverables");
  const tr = useTranslations("revisions");
  const { user } = useAuth();
  const role = user?.role ?? "client";
  const isClientRole = isClient(role);

  const [milestone, setMilestone] = useState<MilestoneDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);

  const fetchMilestone = useCallback(async () => {
    setLoading(true);
    try {
      const data = await browserRequest<MilestoneDetail>(
        `/api/milestones/${milestoneId}/`,
      );
      setMilestone(data);
    } finally {
      setLoading(false);
    }
  }, [milestoneId]);

  useEffect(() => { fetchMilestone(); }, [fetchMilestone]);

  const handleSubmit = useCallback(async (data: { summary: string; notes?: string; external_link?: string }) => {
    await browserRequest(`/api/milestones/${milestoneId}/submit/`, {
      method: "POST",
      body: data,
    });
    setShowSubmitForm(false);
    await fetchMilestone();
  }, [milestoneId, fetchMilestone]);

  const handleRevision = useCallback(async (reason: string) => {
    await browserRequest(`/api/milestones/${milestoneId}/revision/`, {
      method: "POST",
      body: { reason },
    });
    setShowRevisionForm(false);
    await fetchMilestone();
  }, [milestoneId, fetchMilestone]);

  const handleApprove = useCallback(async () => {
    await browserRequest(`/api/milestones/${milestoneId}/approve/`, {
      method: "POST",
    });
    await fetchMilestone();
  }, [milestoneId, fetchMilestone]);

  if (loading) return <div className="p-6"><p>{t("loading")}</p></div>;
  if (!milestone) return <div className="p-6"><p>{t("notFound")}</p></div>;

  const canSubmit = !isClientRole &&
    (milestone.status === MILESTONE_STATUS.IN_PROGRESS || milestone.status === MILESTONE_STATUS.REVISION_REQUESTED);
  const canRequestRevision = isClientRole && milestone.status === MILESTONE_STATUS.SUBMITTED;
  const canApprove = isClientRole && milestone.status === MILESTONE_STATUS.SUBMITTED;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">#{milestone.sequence} {milestone.title}</h1>
        <MilestoneStatusBadge status={milestone.status} />
      </div>

      {milestone.description && (
        <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
      )}

      {milestone.due_date && (
        <p className="text-sm text-gray-500">{t("dueDate")}: {new Date(milestone.due_date).toLocaleDateString()}</p>
      )}

      {milestone.revision_count > 0 && (
        <p className="text-sm text-orange-500">{t("revisions", { count: milestone.revision_count })}</p>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-2">{td("versions") || "Deliverables"}</h2>
        <DeliverableList submissions={milestone.submissions || []} />
      </section>

      {canSubmit && !showSubmitForm && (
        <button
          onClick={() => setShowSubmitForm(true)}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white"
        >
          {milestone.status === MILESTONE_STATUS.REVISION_REQUESTED ? td("resubmit") || t("resubmit") : td("submit")}
        </button>
      )}

      {showSubmitForm && (
        <DeliverableForm
          onSubmit={handleSubmit}
          onCancel={() => setShowSubmitForm(false)}
        />
      )}

      {canRequestRevision && !showRevisionForm && (
        <button
          onClick={() => setShowRevisionForm(true)}
          className="rounded-lg border border-brand px-4 py-2 text-sm font-medium text-brand"
        >
          {tr("request")}
        </button>
      )}

      {showRevisionForm && (
        <RevisionRequestForm
          onSubmit={handleRevision}
          onCancel={() => setShowRevisionForm(false)}
        />
      )}

      {canApprove && (
        <button
          onClick={handleApprove}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white"
        >
          {td("approve")}
        </button>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-2">{tr("history")}</h2>
        <RevisionHistory revisions={milestone.revisions || []} />
      </section>
    </div>
  );
}
