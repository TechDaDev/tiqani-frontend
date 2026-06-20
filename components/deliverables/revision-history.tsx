/**
 * Revision history display.
 */
"use client";

import { useTranslations } from "next-intl";
import type { RevisionRequest } from "@/lib/deliverables/types";

interface RevisionHistoryProps {
  revisions: RevisionRequest[];
  className?: string;
}

export function RevisionHistory({
  revisions,
  className = "",
}: RevisionHistoryProps) {
  const t = useTranslations("revisions");

  if (!revisions || revisions.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t("noRevisions")}
      </p>
    );
  }

  const sorted = [...revisions].sort(
    (a, b) => b.revision_number - a.revision_number,
  );

  return (
    <div className={className}>
      <div className="space-y-2">
        {sorted.map((rev) => (
          <div
            key={rev.id}
            className="rounded-lg border border-orange-100 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/10"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  {t("revisionNumber", { n: rev.revision_number })}
                </p>
                <p className="mt-0.5 text-sm text-orange-700 dark:text-orange-300">
                  {rev.reason}
                </p>
                <p className="mt-0.5 text-xs text-orange-600 dark:text-orange-400">
                  {t("requestedBy", { name: rev.requested_by_name })}
                </p>
              </div>
              <span className="text-xs text-orange-500 shrink-0">
                {new Date(rev.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
