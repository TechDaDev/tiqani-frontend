/**
 * Execution history list.
 */
"use client";

import { useTranslations } from "next-intl";
import type { ExecutionHistoryEvent } from "@/lib/execution/types";
import { ExecutionHistoryItem } from "./execution-history-item";

interface ExecutionHistoryProps {
  events: ExecutionHistoryEvent[];
  isLoading?: boolean;
  className?: string;
}

export function ExecutionHistory({
  events,
  isLoading,
  className = "",
}: ExecutionHistoryProps) {
  const t = useTranslations("executionHistory");

  if (isLoading) {
    return (
      <div className={className}>
        <p className="text-sm text-gray-400">{t("loading")}</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className={className}>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("noEvents")}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ul className="space-y-2" role="list" aria-label={t("title")}>
        {events.map((event) => (
          <ExecutionHistoryItem key={event.id} event={event} />
        ))}
      </ul>
    </div>
  );
}
