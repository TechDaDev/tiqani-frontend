"use client";

import { useTranslations } from "next-intl";
import type { DisputeResolution } from "@/lib/disputes/types";
import { getResolutionLabel } from "@/lib/disputes/status";

interface Props {
  resolution: DisputeResolution;
}

export function ResolutionSummary({ resolution }: Props) {
  const t = useTranslations("disputeResolution");

  return (
    <div className="border border-green-200 bg-green-50 rounded-lg p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500">{t("type")}</p>
          <p className="font-medium">{t(`types.${resolution.resolution_type}`)}</p>
        </div>
        {resolution.client_refund_amount && (
          <div>
            <p className="text-xs text-gray-500">{t("refundAmount")}</p>
            <p className="font-medium">{resolution.client_refund_amount}</p>
          </div>
        )}
        {resolution.resolved_by_name && (
          <div>
            <p className="text-xs text-gray-500">{t("resolvedBy")}</p>
            <p className="font-medium">{resolution.resolved_by_name}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500">{t("date")}</p>
          <p className="font-medium">{new Date(resolution.resolved_at).toLocaleDateString()}</p>
        </div>
      </div>
      {resolution.resolution_reason && (
        <div className="mt-3">
          <p className="text-xs text-gray-500">{t("notes")}</p>
          <p className="text-sm">{resolution.resolution_reason}</p>
        </div>
      )}
    </div>
  );
}
