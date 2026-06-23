import { useTranslations } from "next-intl";
import type { ChargebackEvent } from "@/lib/chargebacks/types";
import { ChargebackStatusBadge } from "./chargeback-status-badge";

interface Props {
  chargeback: ChargebackEvent;
}

export function ChargebackDetail({ chargeback }: Props) {
  const t = useTranslations("chargebacks");

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{t("chargeback")} #{chargeback.id}</p>
          <p className="text-xs text-gray-500">{chargeback.contract_reference}</p>
        </div>
        <ChargebackStatusBadge status={chargeback.status} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <p className="text-gray-500">{t("amount")}</p>
          <p className="font-medium">{chargeback.amount}</p>
        </div>
        <div>
          <p className="text-gray-500">{t("reasonCode")}</p>
          <p className="font-medium">{chargeback.reason_code}</p>
        </div>
        <div>
          <p className="text-gray-500">{t("outcome")}</p>
          <p className="font-medium">{chargeback.outcome || "-"}</p>
        </div>
        <div>
          <p className="text-gray-500">{t("filedDate")}</p>
          <p className="font-medium">{new Date(chargeback.received_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
