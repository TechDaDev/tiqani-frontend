/**
 * Single deliverable card with version info.
 */
"use client";

import { useTranslations } from "next-intl";
import type { DeliverableSubmission } from "@/lib/deliverables/types";
import { SubmissionVersionBadge } from "./submission-version-badge";

interface DeliverableCardProps {
  submission: DeliverableSubmission;
  className?: string;
}

export function DeliverableCard({
  submission,
  className = "",
}: DeliverableCardProps) {
  const t = useTranslations("deliverables");

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 dark:text-gray-100">
            {submission.summary}
          </p>
          {submission.notes && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {submission.notes}
            </p>
          )}
          {submission.external_link && (
            <a
              href={submission.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-xs text-brand hover:underline"
            >
              {t("externalLink")}
            </a>
          )}
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {t("submittedBy", { name: submission.submitted_by_name })}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(submission.created_at).toLocaleString()}
          </p>
        </div>
        <SubmissionVersionBadge version={submission.version} />
      </div>
    </div>
  );
}
