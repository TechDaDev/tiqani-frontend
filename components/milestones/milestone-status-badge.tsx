/**
 * Milestone status badge.
 */
import { useTranslations } from "next-intl";

interface MilestoneStatusBadgeProps {
  status: string;
  className?: string;
}

const colorMap: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  PENDING: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SUBMITTED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  REVISION_REQUESTED: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function MilestoneStatusBadge({
  status,
  className = "",
}: MilestoneStatusBadgeProps) {
  const t = useTranslations("milestoneStatus");
  const label = t(status) || status;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[status] || colorMap.DRAFT} ${className}`}
      role="status"
      aria-label={label}
    >
      {label}
    </span>
  );
}
