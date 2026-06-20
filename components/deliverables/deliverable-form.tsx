/**
 * Deliverable submission form.
 */
"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

interface DeliverableFormProps {
  onSubmit: (data: { summary: string; notes?: string; external_link?: string }) => Promise<void>;
  onCancel?: () => void;
  initialSummary?: string;
  className?: string;
}

export function DeliverableForm({
  onSubmit,
  onCancel,
  initialSummary,
  className = "",
}: DeliverableFormProps) {
  const t = useTranslations("deliverables");
  const [summary, setSummary] = useState(initialSummary ?? "");
  const [notes, setNotes] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (loading || !summary.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        summary: summary.trim(),
        notes: notes.trim() || undefined,
        external_link: externalLink.trim() || undefined,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : t("submitError"));
    } finally {
      setLoading(false);
    }
  }, [loading, summary, notes, externalLink, onSubmit, t]);

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
            {t("summary")} *
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            disabled={loading}
            aria-label={t("summary")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("notes")}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            disabled={loading}
            aria-label={t("notes")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("externalLink")}
          </label>
          <input
            type="url"
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            disabled={loading}
            aria-label={t("externalLink")}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading || !summary.trim()}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            aria-busy={loading}
          >
            {loading ? t("submitting") : t("submit")}
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
