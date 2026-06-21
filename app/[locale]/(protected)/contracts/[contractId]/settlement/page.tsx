"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SettlementEligibility } from "@/components/settlement/settlement-eligibility";
import { SettlementBreakdown } from "@/components/settlement/settlement-breakdown";
import { SettlementStatusBadge } from "@/components/settlement/settlement-status-badge";
import { ReleaseConfirmation } from "@/components/settlement/release-confirmation";
import { SettlementReceipt } from "@/components/settlement/settlement-receipt";
import type { SettlementEligibility as SE, Settlement, FinancialSummary } from "@/lib/settlement/types";
import { mapSettlement, mapFinancialSummary } from "@/lib/settlement/mappers";

export default function SettlementPage() {
  const params = useParams();
  const contractId = params.contractId as string;
  const t = useTranslations("settlement");
  const [eligibility, setEligibility] = useState<SE | null>(null);
  const [settlement, setSettlement] = useState<Settlement | null>(null);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [eligRes, setRes, sumRes] = await Promise.all([
        fetch(`/api/contracts/${contractId}/settlement/eligibility/`),
        fetch(`/api/contracts/${contractId}/settlement/`),
        fetch(`/api/contracts/${contractId}/financial-summary/`),
      ]);
      if (eligRes.ok) {
        const e = await eligRes.json();
        setEligibility({ eligible: e.eligible, reason: e.reason ?? null });
      }
      if (setRes.ok) setSettlement(mapSettlement(await setRes.json()));
      else if (setRes.status === 404) setSettlement(null);
      if (sumRes.ok) setSummary(mapFinancialSummary(await sumRes.json()));

      if (!eligRes.ok && !setRes.ok && !sumRes.ok) {
        throw new Error("Failed to load settlement data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleRelease = async (idempotencyKey: string) => {
    setProcessing(true);
    setError(null);
    try {
      const res = await fetch(`/api/contracts/${contractId}/settlements/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idempotency_key: idempotencyKey }),
      });
      if (res.status === 409) {
        setError(t("staleState"));
        await fetchAll();
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Release failed");
      }
      await fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-2xl p-6"><div className="h-64 animate-pulse rounded bg-gray-100" /></div>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <Link href={`/contracts/${contractId}`} className="text-sm text-blue-600 hover:underline">
        &larr; {t("backToContract")}
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">{t("escrowRelease")}</h1>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
          <button onClick={fetchAll} className="ml-2 underline">{t("retry")}</button>
        </div>
      )}

      {eligibility && <SettlementEligibility eligibility={eligibility} isLoading={false} />}

      {summary?.payment_breakdown && (
        <SettlementBreakdown breakdown={summary.payment_breakdown} />
      )}

      {settlement && settlement.status === "completed" ? (
        <SettlementReceipt settlement={settlement} />
      ) : eligibility?.eligible ? (
        <ReleaseConfirmation
          onConfirm={handleRelease}
          isProcessing={processing}
          error={null}
        />
      ) : null}
    </div>
  );
}
