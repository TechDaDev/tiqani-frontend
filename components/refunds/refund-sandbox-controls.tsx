"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { adminSandboxConfirmRefund } from "@/lib/api/refunds";
import type { RefundRecord } from "@/lib/refunds/types";

interface Props {
  refund: RefundRecord;
  onConfirmed: () => void;
}

export function RefundSandboxControls({ refund, onConfirmed }: Props) {
  const t = useTranslations("refunds");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (refund.status !== "pending") return null;

  async function handleConfirm() {
    setError(null); setSubmitting(true);
    try {
      await adminSandboxConfirmRefund(refund.id);
      onConfirmed();
    } catch {
      setError(t("errors.confirmFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
      <p className="text-sm mb-2">{t("sandboxConfirm")}</p>
      {error && <p className="text-red-800 text-sm mb-2">{error}</p>}
      <button onClick={handleConfirm} disabled={submitting}
        className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50">
        {submitting ? t("confirming") : t("confirmRefund")}
      </button>
    </div>
  );
}
