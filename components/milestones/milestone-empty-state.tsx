/**
 * Milestone empty state.
 */
import { useTranslations } from "next-intl";

interface MilestoneEmptyStateProps {
  isClient: boolean;
  className?: string;
}

export function MilestoneEmptyState({
  isClient,
  className = "",
}: MilestoneEmptyStateProps) {
  const t = useTranslations("milestones");

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600 ${className}`}
    >
      <p className="text-gray-500 dark:text-gray-400">
        {t("noMilestones")}
      </p>
      {isClient && (
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          {t("createFirstMilestone")}
        </p>
      )}
    </div>
  );
}
