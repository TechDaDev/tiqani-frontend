import type { DisputeStatus } from "@/lib/disputes/types";
import { getDisputeStatusLabel, getDisputeStatusColor } from "@/lib/disputes/status";

interface Props {
  status: DisputeStatus | string;
}

export function DisputeStatusBadge({ status }: Props) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${getDisputeStatusColor(status)}`}>
      {getDisputeStatusLabel(status)}
    </span>
  );
}
