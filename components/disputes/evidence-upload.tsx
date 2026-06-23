"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { addEvidence } from "@/lib/api/disputes";
import type { Dispute, EvidenceType } from "@/lib/disputes/types";

interface Props {
  disputeId: string;
  onUploaded: (dispute: Dispute) => void;
}

const EVIDENCE_TYPES: { value: EvidenceType; labelKey: string }[] = [
  { value: "document", labelKey: "evidenceTypes.document" },
  { value: "image", labelKey: "evidenceTypes.image" },
  { value: "message_reference", labelKey: "evidenceTypes.messageScreenshot" },
  { value: "deliverable_reference", labelKey: "evidenceTypes.fileAttachment" },
  { value: "other", labelKey: "evidenceTypes.other" },
];

export function EvidenceUpload({ disputeId, onUploaded }: Props) {
  const t = useTranslations("disputeEvidence");
  const [evidenceType, setEvidenceType] = useState<EvidenceType>("document");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setError(null);
    setSubmitting(true);
    try {
      const result = await addEvidence(disputeId, {
        evidence_type: evidenceType,
        description,
      });
      onUploaded(result);
      setFile(null);
      setDescription("");
    } catch {
      setError(t("errors.uploadFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">{t("evidenceType")}</label>
          <select value={evidenceType} onChange={(e) => setEvidenceType(e.target.value as EvidenceType)}
            className="w-full border rounded p-2 text-sm">
            {EVIDENCE_TYPES.map((et) => (
              <option key={et.value} value={et.value}>{t(et.labelKey)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("file")}</label>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)}
            required className="w-full text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t("description")}</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
          maxLength={500} className="w-full border rounded p-2 text-sm" />
      </div>
      {error && <p className="text-red-800 text-sm">{error}</p>}
      <button type="submit" disabled={submitting || !file}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50">
        {submitting ? t("uploading") : t("upload")}
      </button>
    </form>
  );
}
