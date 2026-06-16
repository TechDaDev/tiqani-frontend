/**
 * Contract status badge — minimal Phase 6 display.
 */
import { useTranslations } from "next-intl";

interface ContractStatusBadgeProps {
  status: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function ContractStatusBadge({ status, className = "" }: ContractStatusBadgeProps) {
  const t = useTranslations("contracts.statusLabels");
  const colorClass = statusColors[status] || statusColors.draft;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass} ${className}`}
    >
      {t(status) || status}
    </span>
  );
}
