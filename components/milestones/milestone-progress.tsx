/**
 * Milestone progress summary.
 */
"use client";

import { useTranslations } from "next-intl";
import type { Milestone } from "@/lib/milestones/types";
import { MILESTONE_STATUS } from "@/lib/milestones/types";

interface MilestoneProgressProps {
  milestones: Milestone[];
  className?: string;
}

export function MilestoneProgress({
  milestones,
  className = "",
}: MilestoneProgressProps) {
  const t = useTranslations("milestones");
  const total = milestones.length;
  const approved = milestones.filter(
    (m) => m.status === MILESTONE_STATUS.APPROVED,
  ).length;
  const pct = total > 0 ? Math.round((approved / total) * 100) : 0;

  if (total === 0) return null;

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          {t("progress")}
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {approved}/{total}
        </span>
      </div>
      <div
        className="mt-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-brand transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
