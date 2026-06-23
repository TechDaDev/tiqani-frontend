"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import type { Dispute, DisputeReconciliation } from "@/lib/disputes/types";
import { fetchAdminDispute, fetchDisputeReconciliation } from "@/lib/api/disputes";
import { DisputeStatusBadge } from "@/components/disputes/dispute-status-badge";
import { DisputeTimeline } from "@/components/disputes/dispute-timeline";
import { AdminDisputeActions } from "@/components/disputes/admin-dispute-actions";
import { ResolutionSummary } from "@/components/disputes/resolution-summary";
import { DisputeReconciliationPanel } from "@/components/disputes/dispute-reconciliation";

export default function AdminDisputeDetailPage() {
  const t = useTranslations("adminDisputes");
  const params = useParams();
  const disputeId = params.disputeId as string;
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [reconciliation, setReconciliation] = useState<DisputeReconciliation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [d, r] = await Promise.all([
        fetchAdminDispute(disputeId),
        fetchDisputeReconciliation(disputeId).catch(() => null),
      ]);
      setDispute(d);
      setReconciliation(r);
    } catch {
      setError(t("errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [disputeId, t]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className="p-6">{t("loading")}</div>;
  if (error) return <div className="p-6 text-red-800">{error}</div>;
  if (!dispute) return <div className="p-6 text-gray-500">{t("notFound")}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto" dir="auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("detailTitle")}</h1>
          <p className="text-gray-600">{dispute.contract_reference}</p>
        </div>
        <DisputeStatusBadge status={dispute.status} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">{t("openedBy")}</p>
          <p className="font-medium">{dispute.opened_by_name}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">{t("respondent")}</p>
          <p className="font-medium">{dispute.respondent_name}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">{t("reason")}</p>
          <p className="font-medium">{dispute.reason_display}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">{t("claimedAmount")}</p>
          <p className="font-medium">{dispute.claimed_amount} {dispute.currency}</p>
        </div>
      </div>

      <div className="mb-6">
        <AdminDisputeActions dispute={dispute} onAction={loadData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">{t("statements")}</h2>
          {dispute.statements?.map((s) => (
            <div key={s.id} className="border rounded-lg p-3 mb-2">
              <p className="text-xs text-gray-500">{s.submitted_by_name}</p>
              <p>{s.statement}</p>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">{t("evidence")}</h2>
          {dispute.evidence_items?.map((e) => (
            <div key={e.id} className="border rounded-lg p-3 mb-2">
              <p className="text-xs text-gray-500">{e.evidence_type} - {e.submitted_by_name}</p>
              {e.description && <p className="text-sm">{e.description}</p>}
            </div>
          ))}
        </div>
      </div>

      {dispute.resolution && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">{t("resolution")}</h2>
          <ResolutionSummary resolution={dispute.resolution} />
        </div>
      )}

      {reconciliation && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">{t("reconciliation")}</h2>
          <DisputeReconciliationPanel reconciliation={reconciliation} />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">{t("auditHistory")}</h2>
        <DisputeTimeline auditEvents={dispute.audit_events || []} />
      </div>
    </div>
  );
}
