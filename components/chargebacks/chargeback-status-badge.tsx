import { getChargebackStatusLabel, getChargebackStatusColor } from "@/lib/chargebacks/status";

interface Props {
  status: string;
}

export function ChargebackStatusBadge({ status }: Props) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${getChargebackStatusColor(status)}`}>
      {getChargebackStatusLabel(status)}
    </span>
  );
}
