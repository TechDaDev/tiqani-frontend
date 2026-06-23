"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import type { ChargebackEvent } from "@/lib/chargebacks/types";
import { fetchAdminChargeback } from "@/lib/api/chargebacks";
import { ChargebackDetail } from "@/components/chargebacks/chargeback-detail";
import { ChargebackSandboxControls } from "@/components/chargebacks/chargeback-sandbox-controls";
import { RefundStatusBadge } from "@/components/refunds/refund-status-badge";

export default function AdminChargebackDetailPage() {
  const t = useTranslations("chargebacks");
  const params = useParams();
  const chargebackId = params.chargebackId as string;
  const [chargeback, setChargeback] = useState<ChargebackEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await fetchAdminChargeback(chargebackId);
      setChargeback(data);
    } catch {
      setError(t("errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [chargebackId, t]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="p-6">{t("loading")}</div>;
  if (error) return <div className="p-6 text-red-800">{error}</div>;
  if (!chargeback) return <div className="p-6 text-gray-500">{t("notFound")}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="auto">
      <h1 className="text-2xl font-bold mb-4">{t("detailTitle")}</h1>

      <ChargebackDetail chargeback={chargeback} />

      <div className="mt-6">
        <ChargebackSandboxControls chargeback={chargeback} onAction={load} />
      </div>

      {chargeback.provider_reference && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">{t("evidence")}</h2>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm">{t("providerRef")}: {chargeback.provider_reference}</p>
          </div>
        </div>
      )}
    </div>
  );
}
