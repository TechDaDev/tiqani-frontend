/**
 * Deliverable list — shows all submission versions.
 */
"use client";

import { useTranslations } from "next-intl";
import type { DeliverableSubmission } from "@/lib/deliverables/types";
import { DeliverableCard } from "./deliverable-card";

interface DeliverableListProps {
  submissions: DeliverableSubmission[];
  isLoading?: boolean;
  className?: string;
}

export function DeliverableList({
  submissions,
  isLoading,
  className = "",
}: DeliverableListProps) {
  const t = useTranslations("deliverables");

  if (isLoading) {
    return <p className="text-sm text-gray-400">{t("loading")}</p>;
  }

  if (!submissions || submissions.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t("noSubmissions")}
      </p>
    );
  }

  const sorted = [...submissions].sort((a, b) => b.version - a.version);

  return (
    <div className={className}>
      <div className="space-y-2">
        {sorted.map((sub) => (
          <DeliverableCard key={sub.id} submission={sub} />
        ))}
      </div>
    </div>
  );
}
