"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { RequestStatusBadge } from "./request-status-badge";
import type { ServiceRequest } from "@/lib/requests/types";

interface Props {
  request: ServiceRequest;
  href: string;
  showTechnician?: boolean;
  showClient?: boolean;
}

export function RequestCard({ request, href, showTechnician = true, showClient = false }: Props) {
  const t = useTranslations();

  return (
    <Link
      href={href}
      className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
            {request.title}
          </h3>
          {showTechnician && request.technician.full_name && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {t("requestCard.to")} {request.technician.full_name}
              {request.technician.job_title && ` · ${request.technician.job_title}`}
            </p>
          )}
          {showClient && request.client.full_name && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {t("requestCard.from")} {request.client.full_name}
            </p>
          )}
          <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-300">
            {request.description}
          </p>
          {request.preferred_date && (
            <p className="mt-1 text-xs text-gray-400">
              {t("requestCard.preferredDate")}: {request.preferred_date}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            {new Date(request.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <RequestStatusBadge status={request.status} />
          {request.is_urgent && (
            <span className="text-xs font-medium text-red-500">
              {t("requestCard.urgent")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
