import { getRefundStatusLabel, getRefundStatusColor } from "@/lib/refunds/status";

interface Props {
  status: string;
}

export function RefundStatusBadge({ status }: Props) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${getRefundStatusColor(status)}`}>
      {getRefundStatusLabel(status)}
    </span>
  );
}
