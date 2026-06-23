import { useTranslations } from "next-intl";
import type { RefundRecord } from "@/lib/refunds/types";
import { RefundStatusBadge } from "./refund-status-badge";
import { getRefundSourceLabel } from "@/lib/refunds/status";

interface Props {
  refund: RefundRecord;
}

export function RefundSummary({ refund }: Props) {
  const t = useTranslations("refunds");

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{t("refund")} #{refund.id}</p>
          <p className="text-xs text-gray-500">{t("contract")} #{refund.contract}</p>
        </div>
        <RefundStatusBadge status={refund.status} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500">{t("amount")}</p>
          <p className="font-medium">{refund.amount} {refund.currency}</p>
        </div>
        <div>
          <p className="text-gray-500">{t("source")}</p>
          <p className="font-medium">{getRefundSourceLabel(refund.source_type)}</p>
        </div>
      </div>
      {refund.failure_message && (
        <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-800">
          {refund.failure_message}
        </div>
      )}
    </div>
  );
}
