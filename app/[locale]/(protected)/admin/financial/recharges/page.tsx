"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FinancialFilters } from "@/components/admin/financial/financial-filters";
import { FinancialPageShell } from "@/components/admin/financial/financial-theme";
import { RechargeRequestsTable } from "@/components/admin/financial/recharge-requests-table";
import {
  approveFinancialRechargeRequest,
  fetchFinancialRechargeRequests,
  rejectFinancialRechargeRequest,
} from "@/lib/api/admin-financial";
import type { AdminFinancialRechargeRequest } from "@/lib/admin/financial/types";

export default function FinancialRechargesPage() {
  const t = useTranslations("admin.financial");
  const params = useParams<{ locale: string }>();
  const [status, setStatus] = useState("pending_review");
  const [items, setItems] = useState<AdminFinancialRechargeRequest[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const query = status ? `status=${encodeURIComponent(status)}` : "";
    try {
      const data = await fetchFinancialRechargeRequests(query);
      setItems(data.results);
      setError("");
    } catch {
      setItems([]);
      setError(t("unavailable"));
    }
  }, [status, t]);

  useEffect(() => { void load(); }, [load]);

  async function approve(item: AdminFinancialRechargeRequest, note: string) {
    await approveFinancialRechargeRequest(item.id, note);
    await load();
  }

  async function reject(item: AdminFinancialRechargeRequest, note: string) {
    if (!note.trim()) {
      setError(t("reviewNoteRequired"));
      return;
    }
    await rejectFinancialRechargeRequest(item.id, note);
    await load();
  }

  return (
    <FinancialPageShell title={t("recharges")} description={t("rechargeRequests")} testId="admin-financial-recharges">
      <FinancialFilters
        status={status}
        onStatus={setStatus}
        statuses={["pending_review", "approved", "rejected", "cancelled"]}
      />
      {error ? <p className="rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
      <RechargeRequestsTable
        items={items}
        locale={params.locale || "en"}
        onApprove={approve}
        onReject={reject}
      />
    </FinancialPageShell>
  );
}
