"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cancelDispute } from "@/lib/api/disputes";
import { isDisputeCancelable } from "@/lib/disputes/status";
import type { Dispute } from "@/lib/disputes/types";

interface Props {
  dispute: Dispute;
  onCanceled: () => void;
}

export function DisputeCancelAction({ dispute, onCanceled }: Props) {
  const t = useTranslations("disputes");
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isDisputeCancelable(dispute.status)) return null;

  async function handleCancel() {
    setError(null);
    setSubmitting(true);
    try {
      await cancelDispute(dispute.id);
      onCanceled();
    } catch {
      setError(t("errors.cancelFailed"));
    } finally {
      setSubmitting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm mb-2">{t("cancelConfirm")}</p>
        <div className="flex gap-2">
          <button onClick={handleCancel} disabled={submitting}
            className="bg-red-600 text-white px-4 py-1.5 rounded text-sm hover:bg-red-700 disabled:opacity-50">
            {submitting ? t("canceling") : t("confirmCancel")}
          </button>
          <button onClick={() => setConfirming(false)}
            className="bg-gray-200 px-4 py-1.5 rounded text-sm hover:bg-gray-300">
            {t("back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)}
      className="text-red-600 border border-red-300 px-4 py-1.5 rounded text-sm hover:bg-red-50">
      {t("cancelDispute")}
    </button>
  );
}
