/**
 * Offer status badge — color-coded by status.
 */
import { useTranslations } from "next-intl";
import type { OfferStatus } from "@/lib/offers/types";

interface OfferStatusBadgeProps {
  status: OfferStatus;
  className?: string;
}

const statusColors: Record<OfferStatus, string> = {
  DRAFT: "bg-surface-warm text-foreground-muted dark:bg-gray-800 dark:text-gray-300",
  SUBMITTED: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  ACCEPTED: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  WITHDRAWN: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
};

export function OfferStatusBadge({ status, className = "" }: OfferStatusBadgeProps) {
  const t = useTranslations("offers.statusLabels");
  const colorClass = statusColors[status] || statusColors.DRAFT;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass} ${className}`}
    >
      {t(status)}
    </span>
  );
}
