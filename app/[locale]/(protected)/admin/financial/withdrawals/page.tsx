"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FinancialFilters } from "@/components/admin/financial/financial-filters";
import { FinancialPageShell } from "@/components/admin/financial/financial-theme";
import { WithdrawalsTable } from "@/components/admin/financial/withdrawals-table";
import { fetchFinancialWithdrawals } from "@/lib/api/admin-financial";
import type { AdminFinancialWithdrawal } from "@/lib/admin/financial/types";

export default function FinancialWithdrawalsPage() {
  const t = useTranslations("admin.financial");
  const params = useParams<{ locale: string }>();
  const [status, setStatus] = useState("");
  const [items, setItems] = useState<AdminFinancialWithdrawal[]>([]);
  useEffect(() => {
    const query = status ? `status=${encodeURIComponent(status)}` : "";
    fetchFinancialWithdrawals(query).then((data) => setItems(data.results)).catch(() => setItems([]));
  }, [status]);
  return (
    <FinancialPageShell title={t("withdrawals")} description={t("readOnly")} testId="admin-financial-withdrawals">
      <FinancialFilters status={status} onStatus={setStatus} statuses={["pending", "approved", "processing", "rejected", "paid", "failed", "canceled"]} />
      <WithdrawalsTable items={items} locale={params.locale || "en"} />
    </FinancialPageShell>
  );
}
