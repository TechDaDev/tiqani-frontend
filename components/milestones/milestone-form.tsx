/**
 * Milestone create/edit form.
 */
"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

interface MilestoneFormProps {
  initialData?: {
    title: string;
    description: string;
    dueDate?: string;
    sequence?: number;
  };
  onSubmit: (data: { title: string; description: string; dueDate?: string; sequence?: number }) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export function MilestoneForm({
  initialData,
  onSubmit,
  onCancel,
  className = "",
}: MilestoneFormProps) {
  const t = useTranslations("milestones");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate ?? "");
  const [sequence, setSequence] = useState(
    initialData?.sequence?.toString() ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (loading || !title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || undefined,
        sequence: sequence ? parseInt(sequence, 10) : undefined,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errorCreate"));
    } finally {
      setLoading(false);
    }
  }, [loading, title, description, dueDate, sequence, onSubmit, t]);

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
            {t("formTitle")}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            disabled={loading}
            aria-label={t("formTitle")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("formDescription")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            disabled={loading}
            aria-label={t("formDescription")}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("formDueDate")}
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              disabled={loading}
              aria-label={t("formDueDate")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("formSequence")}
            </label>
            <input
              type="number"
              min={1}
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              disabled={loading}
              aria-label={t("formSequence")}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            aria-busy={loading}
          >
            {loading ? t("saving") : initialData ? t("edit") : t("create")}
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
