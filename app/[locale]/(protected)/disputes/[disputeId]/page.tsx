"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import type { Dispute } from "@/lib/disputes/types";
import { fetchDispute, addStatement, cancelDispute } from "@/lib/api/disputes";
import { getDisputeStatusColor, isDisputeCancelable } from "@/lib/disputes/status";
import { DisputeTimeline } from "@/components/disputes/dispute-timeline";
import { DisputeStatusBadge } from "@/components/disputes/dispute-status-badge";
import { DisputeStatementForm } from "@/components/disputes/dispute-statement-form";
import { EvidenceUpload } from "@/components/disputes/evidence-upload";
import { ResolutionSummary } from "@/components/disputes/resolution-summary";
import { DisputeCancelAction } from "@/components/disputes/dispute-cancel-action";

export default function DisputeDetailPage() {
  const t = useTranslations("disputes");
  const params = useParams();
  const router = useRouter();
  const disputeId = params.disputeId as string;
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDispute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDispute(disputeId);
      setDispute(data);
    } catch {
      setError(t("errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [disputeId, t]);

  useEffect(() => { loadDispute(); }, [loadDispute]);

  if (loading) return <div className="p-6">{t("loading")}</div>;
  if (error) return <div className="p-6 text-red-800">{error}</div>;
  if (!dispute) return <div className="p-6 text-gray-500">{t("notFound")}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">{t("detailTitle")}</h1>
          <p className="text-gray-600">{dispute.contract_reference}</p>
        </div>
        <div className="text-right">
          <DisputeStatusBadge status={dispute.status} />
          <p className="text-sm mt-1">{dispute.claimed_amount} {dispute.currency}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">{t("reason")}</p>
          <p className="font-medium">{dispute.reason_display}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">{t("category")}</p>
          <p className="font-medium">{dispute.category_display || "-"}</p>
        </div>
      </div>

      {dispute.resolution_summary && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500">{t("resolutionSummary")}</p>
          <p>{dispute.resolution_summary}</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">{t("statements")}</h2>
        {dispute.statements?.map((s) => (
          <div key={s.id} className="border rounded-lg p-3 mb-2">
            <p className="text-xs text-gray-500 mb-1">{s.submitted_by_name}</p>
            <p>{s.statement}</p>
          </div>
        ))}
        <DisputeStatementForm disputeId={dispute.id} onAdded={loadDispute} />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">{t("evidence")}</h2>
        {dispute.evidence_items?.map((e) => (
          <div key={e.id} className="border rounded-lg p-3 mb-2">
            <p className="text-xs text-gray-500">{e.evidence_type} - {e.submitted_by_name}</p>
            {e.description && <p className="text-sm">{e.description}</p>}
          </div>
        ))}
        <EvidenceUpload disputeId={dispute.id} onUploaded={loadDispute} />
      </div>

      {dispute.resolution && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">{t("resolution")}</h2>
          <ResolutionSummary resolution={dispute.resolution} />
        </div>
      )}

      <div className="mb-6">
        <DisputeTimeline auditEvents={dispute.audit_events || []} />
      </div>

      {isDisputeCancelable(dispute.status) && (
        <DisputeCancelAction dispute={dispute} onCanceled={() => { loadDispute(); router.push("/disputes"); }} />
      )}
    </div>
  );
}
