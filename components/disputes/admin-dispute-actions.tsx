"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { assignDispute, startReview, startMediation, proposeResolution, resolveDispute, rejectDispute, closeDispute } from "@/lib/api/disputes";
import type { Dispute, ResolutionType } from "@/lib/disputes/types";

interface Props {
  dispute: Dispute;
  onAction: () => void;
}

export function AdminDisputeActions({ dispute, onAction }: Props) {
  const t = useTranslations("adminDisputes");
  const [action, setAction] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const s = dispute.status;

  async function handleAssign() {
    setError(null); setSubmitting(true);
    try { await assignDispute(dispute.id, { staff_id: "" }); onAction(); } catch { setError(t("errors.actionFailed")); }
    finally { setSubmitting(false); setAction(null); }
  }

  async function handleStartReview() {
    setError(null); setSubmitting(true);
    try { await startReview(dispute.id); onAction(); } catch { setError(t("errors.actionFailed")); }
    finally { setSubmitting(false); setAction(null); }
  }

  async function handleStartMediation() {
    setError(null); setSubmitting(true);
    try { await startMediation(dispute.id); onAction(); } catch { setError(t("errors.actionFailed")); }
    finally { setSubmitting(false); setAction(null); }
  }

  async function handleResolve() {
    setError(null); setSubmitting(true);
    try { await resolveDispute(dispute.id, { resolution_type: "no_financial_change", resolution_reason: "" }); onAction(); } catch { setError(t("errors.actionFailed")); }
    finally { setSubmitting(false); setAction(null); }
  }

  async function handleClose() {
    setError(null); setSubmitting(true);
    try { await closeDispute(dispute.id); onAction(); } catch { setError(t("errors.actionFailed")); }
    finally { setSubmitting(false); setAction(null); }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {s === "under_review" && (
          <>
            <button onClick={() => setAction("assign")} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">{t("assignToMe")}</button>
            <button onClick={() => setAction("mediating")} className="bg-orange-500 text-white px-3 py-1.5 rounded text-sm hover:bg-orange-600">{t("resolveViaMediation")}</button>
          </>
        )}
        {s === "awaiting_response" && (
          <button onClick={handleStartReview} disabled={submitting} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50">
            {t("startReview")}
          </button>
        )}
        {s === "resolution_proposed" && (
          <button onClick={() => setAction("mediating")} className="bg-orange-500 text-white px-3 py-1.5 rounded text-sm hover:bg-orange-600">{t("referToMediation")}</button>
        )}
        {s === "mediation" && (
          <>
            <button onClick={() => setAction("resolve")} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700">{t("proposeResolution")}</button>
          </>
        )}
        {s === "closed" && (
          <button onClick={handleClose} disabled={submitting} className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700 disabled:opacity-50">
            {t("closeDispute")}
          </button>
        )}
      </div>

      {action === "assign" && (
        <div className="bg-gray-50 rounded-lg p-3 border">
          <p className="text-sm mb-2">{t("assignConfirm")}</p>
          <div className="flex gap-2">
            <button onClick={handleAssign} disabled={submitting} className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50">{t("confirm")}</button>
            <button onClick={() => setAction(null)} className="bg-gray-200 px-4 py-1.5 rounded text-sm">{t("cancel")}</button>
          </div>
        </div>
      )}

      {action === "mediating" && (
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <p className="text-sm mb-2">{t("mediationConfirm")}</p>
          <div className="flex gap-2">
            <button onClick={handleStartMediation} disabled={submitting} className="bg-orange-500 text-white px-4 py-1.5 rounded text-sm hover:bg-orange-600 disabled:opacity-50">{t("confirm")}</button>
            <button onClick={() => setAction(null)} className="bg-gray-200 px-4 py-1.5 rounded text-sm">{t("cancel")}</button>
          </div>
        </div>
      )}

      {action === "resolve" && (
        <ResolutionForm onPropose={async (type) => {
          try {
            await proposeResolution(dispute.id, { resolution_type: type, resolution_reason: "" });
            onAction();
          } catch {
            setError(t("errors.actionFailed"));
          } finally {
            setAction(null);
          }
        }} onCancel={() => setAction(null)} />
      )}

      {error && <div className="bg-red-100 p-3 rounded text-red-800 text-sm">{error}</div>}
    </div>
  );
}

function ResolutionForm({ onPropose, onCancel }: {
  onPropose: (type: ResolutionType) => Promise<void>;
  onCancel: () => void;
}) {
  const t = useTranslations("adminDisputes");
  const [type, setType] = useState<ResolutionType>("full_client_refund");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
      <label className="block text-sm font-medium mb-1">{t("resolutionType")}</label>
      <select value={type} onChange={(e) => setType(e.target.value as ResolutionType)}
        className="w-full border rounded p-2 text-sm mb-2">
        {["full_client_refund", "partial_client_refund", "full_technician_award",
          "partial_technician_award", "split_resolution", "no_financial_change",
          "dispute_rejected", "manual_recovery_required", "chargeback_upheld", "chargeback_rejected"].map((rt) => (
          <option key={rt} value={rt}>{t(`resolutionTypes.${rt}`)}</option>
        ))}
      </select>
      <div className="flex gap-2">
        <button onClick={() => { setSubmitting(true); onPropose(type).finally(() => setSubmitting(false)); }} disabled={submitting}
          className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700 disabled:opacity-50">
          {submitting ? t("proposing") : t("propose")}
        </button>
        <button onClick={onCancel} className="bg-gray-200 px-4 py-1.5 rounded text-sm">{t("cancel")}</button>
      </div>
    </div>
  );
}
