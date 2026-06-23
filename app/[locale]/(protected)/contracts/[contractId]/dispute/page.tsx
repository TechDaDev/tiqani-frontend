"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import type { DisputeEligibility, ActiveDisputeResponse } from "@/lib/disputes/types";
import { fetchDisputeEligibility, fetchActiveDispute, createDispute } from "@/lib/api/disputes";
import { DisputeForm } from "@/components/disputes/dispute-form";
import { DisputeStatusBadge } from "@/components/disputes/dispute-status-badge";

export default function ContractDisputePage() {
  const t = useTranslations("disputes");
  const params = useParams();
  const router = useRouter();
  const contractId = params.contractId as string;
  const [eligibility, setEligibility] = useState<DisputeEligibility | null>(null);
  const [activeDispute, setActiveDispute] = useState<ActiveDisputeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [elig, active] = await Promise.all([
        fetchDisputeEligibility(contractId),
        fetchActiveDispute(contractId),
      ]);
      setEligibility(elig);
      setActiveDispute(active);
    } catch {
      setError(t("errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [contractId, t]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className="p-6">{t("loading")}</div>;
  if (error) return <div className="p-6 text-red-800">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto" dir="auto">
      <h1 className="text-2xl font-bold mb-4">{t("openDispute")}</h1>

      {activeDispute?.active && activeDispute.dispute ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="font-semibold mb-2">{t("activeDisputeExists")}</p>
          <DisputeStatusBadge status={activeDispute.dispute.status} />
          <button onClick={() => router.push(`/disputes/${activeDispute.dispute!.id}`)}
            className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded">
            {t("viewActiveDispute")}
          </button>
        </div>
      ) : eligibility && !eligibility.eligible ? (
        <div className="bg-gray-50 border rounded-lg p-6 text-center">
          <p className="text-gray-600">{eligibility.reason || t("notEligible")}</p>
        </div>
      ) : (
        <DisputeForm
          contractId={contractId}
          onCreated={(dispute) => router.push(`/disputes/${dispute.id}`)}
        />
      )}
    </div>
  );
}
