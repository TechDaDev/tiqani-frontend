/**
 * Completion rejection form.
 */
"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

interface CompletionRejectionFormProps {
  onReject: (reason: string) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export function CompletionRejectionForm({
  onReject,
  onCancel,
  className = "",
}: CompletionRejectionFormProps) {
  const t = useTranslations("completion");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (loading || !reason.trim()) return;
    setLoading(true);
    try {
      await onReject(reason.trim());
    } finally {
      setLoading(false);
    }
  }, [loading, reason, onReject]);

  return (
    <div className={`rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/20 ${className}`}>
      <p className="font-medium text-red-800 dark:text-red-200">
        {t("rejectTitle")}
      </p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder={t("rejectReason")}
        rows={3}
        className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
        aria-label={t("rejectReason")}
        disabled={loading}
      />
      <div className="mt-2 flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={loading || !reason.trim()}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          aria-busy={loading}
        >
          {loading ? t("rejecting") : t("rejectCompletion")}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-transparent dark:text-gray-300"
          >
            {t("cancel")}
          </button>
        )}
      </div>
    </div>
  );
}
