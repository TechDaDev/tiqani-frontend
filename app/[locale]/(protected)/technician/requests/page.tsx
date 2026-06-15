"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Inbox } from "lucide-react";
import { useTechnicianRequests } from "@/lib/requests/query";
import type { RequestStatus } from "@/lib/requests/types";
import { RequestCard } from "@/components/requests/request-card";

export default function TechnicianRequestsPage() {
  const t = useTranslations("technicianRequests");
  const [filter, setFilter] = useState<RequestStatus | "">("");
  const { data: requests, isLoading, error } = useTechnicianRequests(
    filter ? { status: filter as RequestStatus } : undefined
  );

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

      {/* Status filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["", "PENDING", "ACCEPTED", "DECLINED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as RequestStatus | "")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === s
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {s ? t(`status.${s.toLowerCase()}`) : t("status.all")}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {t("errors.loadFailed")}
        </div>
      )}

      {requests && requests.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Inbox className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">{t("empty")}</p>
        </div>
      )}

      {requests && requests.length > 0 && (
        <div className="space-y-3">
          {requests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              href={`requests/${req.id}`}
              showTechnician={false}
              showClient={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
