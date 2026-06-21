"use client";

import { useTranslations } from "next-intl";
import type { SettlementEligibility } from "@/lib/settlement/types";

interface Props {
  eligibility: SettlementEligibility | null;
  isLoading: boolean;
}

export function SettlementEligibility({ eligibility, isLoading }: Props) {
  const t = useTranslations("settlement");

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-lg bg-gray-100 p-4">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </div>
    );
  }

  if (!eligibility) return null;

  return (
    <div
      className={`rounded-lg border p-4 ${
        eligibility.eligible
          ? "border-green-200 bg-green-50"
          : "border-yellow-200 bg-yellow-50"
      }`}
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-medium">
        {eligibility.eligible
          ? t("eligibleForRelease")
          : t("notEligibleForRelease")}
      </p>
      {eligibility.reason && (
        <p className="mt-1 text-xs text-gray-600">{eligibility.reason}</p>
      )}
    </div>
  );
}
