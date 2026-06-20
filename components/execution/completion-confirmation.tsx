/**
 * Completion confirmation form.
 */
"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

interface CompletionConfirmationProps {
  onConfirm: () => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export function CompletionConfirmation({
  onConfirm,
  onCancel,
  className = "",
}: CompletionConfirmationProps) {
  const t = useTranslations("completion");
  const [loading, setLoading] = useState(false);

  const handleConfirm = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }, [loading, onConfirm]);

  return (
    <div className={`rounded-lg border border-green-300 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/20 ${className}`}>
      <p className="font-medium text-green-800 dark:text-green-200">
        {t("confirmTitle")}
      </p>
      <p className="mt-1 text-sm text-green-700 dark:text-green-300">
        {t("confirmNotice")}
      </p>
      <p className="mt-1 text-sm font-medium text-yellow-700 dark:text-yellow-300">
        {t("fundsRemainHeld")}
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          aria-busy={loading}
        >
          {loading ? t("confirming") : t("confirmCompletion")}
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
