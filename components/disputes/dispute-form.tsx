"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createDispute } from "@/lib/api/disputes";
import type { Dispute, DisputeReason } from "@/lib/disputes/types";

interface Props {
  contractId: string;
  onCreated: (dispute: Dispute) => void;
}

const REASONS: { value: DisputeReason; labelKey: string }[] = [
  { value: "work_not_delivered", labelKey: "reasons.workNotDelivered" },
  { value: "work_incomplete", labelKey: "reasons.workIncomplete" },
  { value: "quality_not_as_agreed", labelKey: "reasons.qualityNotAsAgreed" },
  { value: "misrepresentation", labelKey: "reasons.misrepresentation" },
  { value: "unauthorized_completion", labelKey: "reasons.unauthorizedCompletion" },
  { value: "client_non_cooperation", labelKey: "reasons.clientNonCooperation" },
  { value: "scope_change", labelKey: "reasons.scopeChange" },
  { value: "payment_or_settlement_error", labelKey: "reasons.paymentOrSettlementError" },
  { value: "fraud_suspected", labelKey: "reasons.fraudSuspected" },
  { value: "duplicate_payment", labelKey: "reasons.duplicatePayment" },
  { value: "other", labelKey: "reasons.other" },
];

export function DisputeForm({ contractId, onCreated }: Props) {
  const t = useTranslations("disputes");
  const [reason, setReason] = useState<DisputeReason | "">("");
  const [claimedAmount, setClaimedAmount] = useState("");
  const [statement, setStatement] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const dispute = await createDispute({
        contract_id: contractId,
        reason: reason as DisputeReason,
        statement,
        claimed_amount: claimedAmount,
      });
      onCreated(dispute);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.createFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="dispute-form">
      <div>
        <label htmlFor="dispute-reason" className="block text-sm font-medium mb-1">{t("reason")}</label>
        <select id="dispute-reason" value={reason} onChange={(e) => setReason(e.target.value as DisputeReason)}
          required className="w-full border rounded-lg p-2">
          <option value="">{t("selectReason")}</option>
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>{t(r.labelKey)}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="dispute-amount" className="block text-sm font-medium mb-1">{t("claimedAmount")}</label>
        <input id="dispute-amount" type="text" inputMode="decimal" value={claimedAmount}
          onChange={(e) => setClaimedAmount(e.target.value)}
          required placeholder="0.00"
          className="w-full border rounded-lg p-2" />
      </div>

      <div>
        <label htmlFor="dispute-statement" className="block text-sm font-medium mb-1">{t("statement")}</label>
        <textarea id="dispute-statement" value={statement} onChange={(e) => setStatement(e.target.value)}
          required minLength={20} maxLength={5000} rows={5}
          placeholder={t("statementPlaceholder")}
          className="w-full border rounded-lg p-2" />
        <p className="text-xs text-gray-500 mt-1">{statement.length}/5000</p>
      </div>

      {error && <div className="bg-red-100 p-3 rounded text-red-800 text-sm">{error}</div>}

      <button type="submit" disabled={submitting} data-testid="dispute-submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
        {submitting ? t("submitting") : t("submitDispute")}
      </button>
    </form>
  );
}
