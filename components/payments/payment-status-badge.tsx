"use client";

import { useTranslations } from "next-intl";
import type { FundingStatus } from "@/lib/payments/types";
import { getFundingStatusColor } from "@/lib/payments/status";

interface Props {
  status: FundingStatus;
  className?: string;
}

const colorMap: Record<string, string> = {
  default: "bg-surface-warm text-foreground-muted border-border-warm",
  success: "bg-success-soft text-success border-transparent",
  warning: "bg-warning-soft text-warning border-transparent",
  danger: "bg-danger-soft text-danger border-transparent",
  info: "bg-info-soft text-info border-transparent",
};

export function PaymentStatusBadge({ status, className = "" }: Props) {
  const t = useTranslations("paymentStatus");
  const color = getFundingStatusColor(status);
  const config = {
    unfunded: "paymentStatus.unfunded",
    pending: "paymentStatus.pending",
    funded: "paymentStatus.funded",
    failed: "paymentStatus.failed",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorMap[color]} ${className}`}
    >
      {t(status)}
    </span>
  );
}
