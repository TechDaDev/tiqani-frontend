/**
 * Execution progress bar — milestone completion visual.
 */
import { useTranslations } from "next-intl";

interface ExecutionProgressProps {
  approvedCount: number;
  totalCount: number;
  className?: string;
}

export function ExecutionProgress({
  approvedCount,
  totalCount,
  className = "",
}: ExecutionProgressProps) {
  const t = useTranslations("execution");
  const pct = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  return (
    <div className={className} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={t("progressLabel")}>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[3rem] text-right">
          {approvedCount}/{totalCount}
        </span>
      </div>
    </div>
  );
}
