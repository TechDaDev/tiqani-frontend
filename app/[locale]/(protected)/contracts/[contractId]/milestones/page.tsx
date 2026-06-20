"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { browserRequest } from "@/lib/api/browser-client";
import { useAuth } from "@/components/auth/auth-provider";
import { isClient } from "@/lib/auth/guards";
import { MilestoneList } from "@/components/milestones/milestone-list";
import { MilestoneForm } from "@/components/milestones/milestone-form";
import { MilestoneProgress } from "@/components/milestones/milestone-progress";
import type { Milestone, MilestoneCreatePayload } from "@/lib/milestones/types";

export default function MilestonesPage() {
  const params = useParams();
  const contractId = params.contractId as string;
  const t = useTranslations("milestones");
  const { user } = useAuth();
  const role = user?.role ?? "client";
  const isClientRole = isClient(role);

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchMilestones = useCallback(async () => {
    setLoading(true);
    try {
      const data = await browserRequest<{ count: number; results: Milestone[] }>(
        `/api/contracts/${contractId}/milestones/`,
      );
      setMilestones(data.results);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => { fetchMilestones(); }, [fetchMilestones]);

  const handleCreate = useCallback(async (data: MilestoneCreatePayload) => {
    await browserRequest(`/api/contracts/${contractId}/milestones/`, {
      method: "POST",
      body: data,
    });
    setShowForm(false);
    await fetchMilestones();
  }, [contractId, fetchMilestones]);

  const handleStart = useCallback(async (id: string) => {
    await browserRequest(`/api/contracts/milestones/${id}/start/`, { method: "POST" });
    await fetchMilestones();
  }, [fetchMilestones]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      <MilestoneProgress milestones={milestones} />

      {isClientRole && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white"
        >
          {t("create")}
        </button>
      )}

      {showForm && (
        <MilestoneForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <MilestoneList
        milestones={milestones}
        isClient={isClientRole}
        isLoading={loading}
        onStart={handleStart}
      />
    </div>
  );
}
