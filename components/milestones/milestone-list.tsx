/**
 * Milestone list — ordered, with actions.
 */
"use client";

import { useTranslations } from "next-intl";
import type { Milestone } from "@/lib/milestones/types";
import { sortMilestones } from "@/lib/milestones/mappers";
import { MilestoneCard } from "./milestone-card";
import { MilestoneEmptyState } from "./milestone-empty-state";

interface MilestoneListProps {
  milestones: Milestone[];
  isClient: boolean;
  isLoading?: boolean;
  className?: string;
  onStart?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function MilestoneList({
  milestones,
  isClient,
  isLoading,
  className = "",
  onStart,
  onEdit,
}: MilestoneListProps) {
  const t = useTranslations("milestones");
  const sorted = sortMilestones(milestones);

  if (isLoading) {
    return <p className="text-sm text-gray-400">{t("loading")}</p>;
  }

  if (sorted.length === 0) {
    return <MilestoneEmptyState isClient={isClient} className={className} />;
  }

  return (
    <div className={className}>
      <div className="space-y-2">
        {sorted.map((ms) => (
          <MilestoneCard
            key={ms.id}
            id={ms.id}
            sequence={ms.sequence}
            title={ms.title}
            description={ms.description}
            status={ms.status}
            dueDate={ms.due_date}
            revisionCount={ms.revision_count}
            isClient={isClient}
            onStart={onStart}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
