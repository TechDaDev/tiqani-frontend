"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FinancialFilters } from "@/components/admin/financial/financial-filters";
import { FinancialPageShell } from "@/components/admin/financial/financial-theme";
import { RefundsTable } from "@/components/admin/financial/refunds-table";
import { fetchFinancialRefunds } from "@/lib/api/admin-financial";
import type { AdminFinancialRefund } from "@/lib/admin/financial/types";

export default function FinancialRefundsPage() {
  const t = useTranslations("admin.financial");
  const params = useParams<{ locale: string }>();
  const [status, setStatus] = useState("");
  const [items, setItems] = useState<AdminFinancialRefund[]>([]);
  useEffect(() => {
    const query = status ? `status=${encodeURIComponent(status)}` : "";
    fetchFinancialRefunds(query).then((data) => setItems(data.results)).catch(() => setItems([]));
  }, [status]);
  return (
    <FinancialPageShell title={t("refunds")} testId="admin-financial-refunds">
      <FinancialFilters status={status} onStatus={setStatus} statuses={["pending", "processing", "completed", "failed", "canceled", "partially_completed"]} />
      <RefundsTable items={items} locale={params.locale || "en"} />
    </FinancialPageShell>
  );
}
