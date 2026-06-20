/**
 * Milestone action buttons — role-specific.
 */
"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { MILESTONE_STATUS } from "@/lib/milestones/types";
import type { MilestoneStatus } from "@/lib/milestones/types";

interface MilestoneActionsProps {
  status: MilestoneStatus;
  isClient: boolean;
  onStart?: () => Promise<void>;
  onEdit?: () => void;
  className?: string;
}

export function MilestoneActions({
  status,
  isClient,
  onStart,
  onEdit,
  className = "",
}: MilestoneActionsProps) {
  const t = useTranslations("milestones");
  const [loading, setLoading] = useState(false);

  const handleStart = useCallback(async () => {
    if (loading || !onStart) return;
    setLoading(true);
    try {
      await onStart();
    } finally {
      setLoading(false);
    }
  }, [loading, onStart]);

  const canEdit = isClient && status === MILESTONE_STATUS.DRAFT && onEdit;
  const canStart =
    !isClient && status === MILESTONE_STATUS.PENDING && onStart;

  return (
    <div className={`flex gap-2 ${className}`}>
      {canEdit && (
        <button
          onClick={onEdit}
          className="text-xs text-brand hover:underline"
        >
          {t("edit")}
        </button>
      )}
      {canStart && (
        <button
          onClick={handleStart}
          disabled={loading}
          className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
          aria-busy={loading}
        >
          {loading ? t("starting") : t("start")}
        </button>
      )}
    </div>
  );
}
