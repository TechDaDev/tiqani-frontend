/**
 * Milestone card — displays a single milestone with actions.
 */
import { useTranslations } from "next-intl";
import { MilestoneStatusBadge } from "./milestone-status-badge";

interface MilestoneCardProps {
  id: string;
  sequence: number;
  title: string;
  description: string;
  status: string;
  dueDate: string | null;
  revisionCount: number;
  isClient: boolean;
  className?: string;
  onStart?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function MilestoneCard({
  id,
  sequence,
  title,
  description,
  status,
  dueDate,
  revisionCount,
  isClient,
  className = "",
  onStart,
  onEdit,
}: MilestoneCardProps) {
  const t = useTranslations("milestones");

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
              #{sequence}
            </span>
            <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          </div>
          {description && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          )}
          {dueDate && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {t("dueDate")}: {new Date(dueDate).toLocaleDateString()}
            </p>
          )}
          {revisionCount > 0 && (
            <p className="mt-1 text-xs text-orange-500">
              {t("revisions", { count: revisionCount })}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <MilestoneStatusBadge status={status} />
        </div>
      </div>
    </div>
  );
}
