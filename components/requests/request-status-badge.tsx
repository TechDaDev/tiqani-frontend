"use client";

import { useTranslations } from "next-intl";
import { getRequestStatusLabelKey, getRequestStatusTone } from "@/lib/requests/status";
import type { RequestStatus } from "@/lib/requests/types";

interface Props {
  status: RequestStatus;
}

const toneStyles: Record<string, string> = {
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  secondary: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  default: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

export function RequestStatusBadge({ status }: Props) {
  const t = useTranslations();
  const labelKey = getRequestStatusLabelKey(status);
  const tone = getRequestStatusTone(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneStyles[tone] || toneStyles.default}`}
    >
      {t(labelKey)}
    </span>
  );
}
