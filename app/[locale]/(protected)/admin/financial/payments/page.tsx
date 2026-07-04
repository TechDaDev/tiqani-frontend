"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FinancialFilters } from "@/components/admin/financial/financial-filters";
import { PaymentsTable } from "@/components/admin/financial/payments-table";
import { fetchFinancialPayments } from "@/lib/api/admin-financial";
import type { AdminFinancialPayment } from "@/lib/admin/financial/types";

export default function FinancialPaymentsPage() {
  const t = useTranslations("admin.financial");
  const params = useParams<{ locale: string }>();
  const [status, setStatus] = useState("");
  const [items, setItems] = useState<AdminFinancialPayment[]>([]);
  useEffect(() => {
    const query = status ? `status=${encodeURIComponent(status)}` : "";
    fetchFinancialPayments(query).then((data) => setItems(data.results)).catch(() => setItems([]));
  }, [status]);
  return (
    <div className="space-y-4" data-testid="admin-financial-payments">
      <h1 className="text-2xl font-semibold">{t("payments")}</h1>
      <FinancialFilters status={status} onStatus={setStatus} statuses={["pending", "requires_action", "paid", "failed", "canceled"]} />
      <PaymentsTable items={items} locale={params.locale || "en"} />
    </div>
  );
}
