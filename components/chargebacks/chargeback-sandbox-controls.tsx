"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { sandboxUpholdChargeback, sandboxRejectChargeback, sandboxPartialChargeback } from "@/lib/api/chargebacks";
import type { ChargebackEvent } from "@/lib/chargebacks/types";

interface Props {
  chargeback: ChargebackEvent;
  onAction: () => void;
}

export function ChargebackSandboxControls({ chargeback, onAction }: Props) {
  const t = useTranslations("chargebacks");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (chargeback.status !== "under_review") return null;

  async function handleUphold() {
    setError(null); setSubmitting(true);
    try { await sandboxUpholdChargeback(chargeback.id); onAction(); }
    catch { setError(t("errors.actionFailed")); }
    finally { setSubmitting(false); }
  }

  async function handleReject() {
    setError(null); setSubmitting(true);
    try { await sandboxRejectChargeback(chargeback.id); onAction(); }
    catch { setError(t("errors.actionFailed")); }
    finally { setSubmitting(false); }
  }

  async function handlePartial() {
    setError(null); setSubmitting(true);
    try { await sandboxPartialChargeback(chargeback.id, { partial_amount: String(Number(chargeback.amount) / 2) }); onAction(); }
    catch { setError(t("errors.actionFailed")); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p className="text-sm font-medium mb-3">{t("sandboxActions")}</p>
      {error && <p className="text-red-800 text-sm mb-2">{error}</p>}
      <div className="flex gap-2">
        <button onClick={handleUphold} disabled={submitting}
          className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700 disabled:opacity-50">{t("uphold")}</button>
        <button onClick={handleReject} disabled={submitting}
          className="bg-red-600 text-white px-4 py-1.5 rounded text-sm hover:bg-red-700 disabled:opacity-50">{t("reject")}</button>
        <button onClick={handlePartial} disabled={submitting}
          className="bg-orange-500 text-white px-4 py-1.5 rounded text-sm hover:bg-orange-600 disabled:opacity-50">{t("partial")}</button>
      </div>
    </div>
  );
}
