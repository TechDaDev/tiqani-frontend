"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FinancialFilters } from "@/components/admin/financial/financial-filters";
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
    <div className="space-y-4" data-testid="admin-financial-withdrawals">
      <h1 className="text-2xl font-semibold">{t("withdrawals")}</h1>
      <p className="text-sm text-gray-500">{t("readOnly")}</p>
      <FinancialFilters status={status} onStatus={setStatus} statuses={["pending", "approved", "processing", "rejected", "paid", "failed", "canceled"]} />
      <WithdrawalsTable items={items} locale={params.locale || "en"} />
    </div>
  );
}
