"use client";

import type { SettlementStatus } from "@/lib/settlement/types";
import { getSettlementStatusLabel, getSettlementStatusColor } from "@/lib/settlement/status";

interface Props {
  status: SettlementStatus;
  className?: string;
}

export function SettlementStatusBadge({ status, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSettlementStatusColor(status)} ${className}`}
      role="status"
      aria-label={`Settlement status: ${getSettlementStatusLabel(status)}`}
    >
      {getSettlementStatusLabel(status)}
    </span>
  );
}
