"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { browserRequest } from "@/lib/api/browser-client";
import { ExecutionHistory } from "@/components/execution/execution-history";
import type { ExecutionHistoryEvent } from "@/lib/execution/types";

export default function HistoryPage() {
  const params = useParams();
  const contractId = params.contractId as string;
  const t = useTranslations("executionHistory");

  const [events, setEvents] = useState<ExecutionHistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await browserRequest<ExecutionHistoryEvent[]>(
        `/api/contracts/${contractId}/execution-history/`,
      );
      setEvents(data);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <ExecutionHistory events={events} isLoading={loading} />
    </div>
  );
}
