"use client";

import { useTranslations } from "next-intl";
import type { DisputeEligibility } from "@/lib/disputes/types";

interface Props {
  eligibility: DisputeEligibility;
}

export function DisputeEligibilityPanel({ eligibility }: Props) {
  const t = useTranslations("disputes");

  if (!eligibility) return null;

  return (
    <div className={`rounded-lg p-4 ${eligibility.eligible ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
      <p className="font-semibold mb-1">
        {eligibility.eligible ? t("eligible") : t("notEligible")}
      </p>
      {eligibility.reason && (
        <p className="text-sm text-gray-700">{eligibility.reason}</p>
      )}
    </div>
  );
}
