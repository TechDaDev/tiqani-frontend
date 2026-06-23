import { useTranslations } from "next-intl";
import type { DisputeReconciliation } from "@/lib/disputes/types";

interface Props {
  reconciliation: DisputeReconciliation;
}

export function DisputeReconciliationPanel({ reconciliation }: Props) {
  const t = useTranslations("disputeResolution");

  const rows = [
    { label: t("totalContractValue"), value: reconciliation.client_refund_amount },
    { label: t("amountInEscrow"), value: reconciliation.technician_retained },
    { label: t("amountReleasedToDisputant"), value: reconciliation.client_refund_amount },
    { label: t("amountReleasedToRespondent"), value: reconciliation.technician_retained },
    { label: t("refundsIssued"), value: reconciliation.refund_total },
    { label: t("chargebacksFiled"), value: reconciliation.unrecoverable },
    { label: t("netExposure"), value: reconciliation.outstanding_liability },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b last:border-0">
              <td className="p-2 text-gray-600">{row.label}</td>
              <td className="p-2 text-right font-medium">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
