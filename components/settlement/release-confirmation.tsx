"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

interface Props {
  onConfirm: (idempotencyKey: string) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
  disabled?: boolean;
}

export function ReleaseConfirmation({ onConfirm, isProcessing, error, disabled }: Props) {
  const t = useTranslations("settlement");
  const [confirmed, setConfirmed] = useState(false);

  const handleRelease = useCallback(async () => {
    if (disabled || isProcessing) return;
    const key = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    await onConfirm(key);
  }, [onConfirm, disabled, isProcessing]);

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <h3 className="text-sm font-semibold text-red-800">{t("releaseEscrow")}</h3>
      <p className="mt-1 text-xs text-red-700">{t("irreversibleWarning")}</p>
      <label className="mt-3 flex items-center gap-2">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
          disabled={isProcessing}
          aria-label={t("confirmReleaseLabel")}
        />
        <span className="text-sm text-gray-700">{t("confirmReleaseLabel")}</span>
      </label>
      <button
        type="button"
        onClick={handleRelease}
        disabled={!confirmed || isProcessing || disabled}
        className="mt-3 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={t("releaseEscrow")}
      >
        {isProcessing ? t("processing") : t("releaseEscrow")}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
