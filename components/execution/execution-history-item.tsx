/**
 * Single execution history event.
 */
"use client";

import { useTranslations } from "next-intl";
import type { ExecutionHistoryEvent } from "@/lib/execution/types";

interface ExecutionHistoryItemProps {
  event: ExecutionHistoryEvent;
}

const eventTypeLabels: Record<string, string> = {
  CONTRACT_ACTIVATED: "event_CONTRACT_ACTIVATED",
  MILESTONE_CREATED: "event_MILESTONE_CREATED",
  MILESTONE_STARTED: "event_MILESTONE_STARTED",
  DELIVERABLE_SUBMITTED: "event_DELIVERABLE_SUBMITTED",
  REVISION_REQUESTED: "event_REVISION_REQUESTED",
  MILESTONE_APPROVED: "event_MILESTONE_APPROVED",
  COMPLETION_REQUESTED: "event_COMPLETION_REQUESTED",
  COMPLETION_CONFIRMED: "event_COMPLETION_CONFIRMED",
  COMPLETION_REJECTED: "event_COMPLETION_REJECTED",
};

export function ExecutionHistoryItem({ event }: ExecutionHistoryItemProps) {
  const t = useTranslations("executionHistory");
  const label = eventTypeLabels[event.event_type]
    ? t(eventTypeLabels[event.event_type])
    : event.event_type;
  const formattedDate = new Date(event.created_at).toLocaleString();

  return (
    <li className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
      <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {event.actor_name && (
            <span className="mr-2">{event.actor_name}</span>
          )}
          <time dateTime={event.created_at}>{formattedDate}</time>
        </p>
      </div>
    </li>
  );
}
