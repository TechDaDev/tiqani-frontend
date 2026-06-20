/**
 * Completion request card — shows pending completion state.
 */
"use client";

import { useTranslations } from "next-intl";
import type { CompletionRequest } from "@/lib/execution/types";

interface CompletionRequestCardProps {
  request: CompletionRequest;
  className?: string;
}

export function CompletionRequestCard({
  request,
  className = "",
}: CompletionRequestCardProps) {
  const t = useTranslations("completion");

  return (
    <div
      className={`rounded-lg border border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-700 dark:bg-yellow-900/20 ${className}`}
      role="status"
    >
      <p className="font-medium text-yellow-800 dark:text-yellow-200">
        {t("pendingRequest")}
      </p>
      {request.completion_message && (
        <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
          {request.completion_message}
        </p>
      )}
      <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
        {t("requestedBy")}: {request.requested_by_name}
      </p>
    </div>
  );
}
