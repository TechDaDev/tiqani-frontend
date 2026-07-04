"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FinancialFilters } from "@/components/admin/financial/financial-filters";
import { FinancialPageShell } from "@/components/admin/financial/financial-theme";
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
    <FinancialPageShell title={t("payments")} testId="admin-financial-payments">
      <FinancialFilters status={status} onStatus={setStatus} statuses={["pending", "requires_action", "paid", "failed", "canceled"]} />
      <PaymentsTable items={items} locale={params.locale || "en"} />
    </FinancialPageShell>
  );
}
