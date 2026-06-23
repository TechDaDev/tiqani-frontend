"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import type { RefundRecord } from "@/lib/refunds/types";
import { fetchRefund } from "@/lib/api/refunds";
import { RefundSummary } from "@/components/refunds/refund-summary";
import { RefundSandboxControls } from "@/components/refunds/refund-sandbox-controls";

export default function AdminRefundDetailPage() {
  const t = useTranslations("refunds");
  const params = useParams();
  const refundId = params.refundId as string;
  const [refund, setRefund] = useState<RefundRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await fetchRefund(refundId);
      setRefund(data);
    } catch {
      setError(t("errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [refundId, t]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="p-6">{t("loading")}</div>;
  if (error) return <div className="p-6 text-red-800">{error}</div>;
  if (!refund) return <div className="p-6 text-gray-500">{t("notFound")}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="auto">
      <h1 className="text-2xl font-bold mb-4">{t("detailTitle")}</h1>
      <RefundSummary refund={refund} />
      <div className="mt-4">
        <RefundSandboxControls refund={refund} onConfirmed={load} />
      </div>

      {refund.failure_message && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">{t("failureDetails")}</h2>
          <p className="text-sm text-red-800">{refund.failure_message}</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p>{t("created")}: {new Date(refund.initiated_at).toLocaleString()}</p>
        {refund.completed_at && <p>{t("updated")}: {new Date(refund.completed_at).toLocaleString()}</p>}
      </div>
    </div>
  );
}
