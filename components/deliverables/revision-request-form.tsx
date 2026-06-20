/**
 * Revision request form.
 */
"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

interface RevisionRequestFormProps {
  onSubmit: (reason: string) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export function RevisionRequestForm({
  onSubmit,
  onCancel,
  className = "",
}: RevisionRequestFormProps) {
  const t = useTranslations("revisions");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (loading || !reason.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit(reason.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : t("requestError"));
    } finally {
      setLoading(false);
    }
  }, [loading, reason, onSubmit, t]);

  return (
    <div className={className}>
      {error && (
        <p className="mb-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("reason")} *
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            disabled={loading}
            aria-label={t("reason")}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading || !reason.trim()}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            aria-busy={loading}
          >
            {loading ? t("requesting") : t("request")}
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
    </div>
  );
}
