"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { addStatement } from "@/lib/api/disputes";
import type { Dispute } from "@/lib/disputes/types";

interface Props {
  disputeId: string;
  onAdded: (dispute: Dispute) => void;
}

export function DisputeStatementForm({ disputeId, onAdded }: Props) {
  const t = useTranslations("disputes");
  const [statement, setStatement] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await addStatement(disputeId, { statement });
      onAdded(result);
      setStatement("");
    } catch {
      setError(t("errors.statementFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea value={statement} onChange={(e) => setStatement(e.target.value)}
        required minLength={10} maxLength={5000} rows={4}
        placeholder={t("statementPlaceholder")}
        aria-label={t("addStatement")}
        className="w-full border rounded-lg p-2" />
      {error && <p className="text-red-800 text-sm">{error}</p>}
      <button type="submit" disabled={submitting || !statement.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50">
        {submitting ? t("submitting") : t("addStatement")}
      </button>
    </form>
  );
}
