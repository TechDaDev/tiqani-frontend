"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FinancialFilters } from "@/components/admin/financial/financial-filters";
import { FinancialPageShell } from "@/components/admin/financial/financial-theme";
import { LedgerTable } from "@/components/admin/financial/ledger-table";
import { fetchFinancialLedger } from "@/lib/api/admin-financial";
import type { AdminFinancialLedgerEntry } from "@/lib/admin/financial/types";

export default function FinancialLedgerPage() {
  const t = useTranslations("admin.financial");
  const params = useParams<{ locale: string }>();
  const [type, setType] = useState("");
  const [items, setItems] = useState<AdminFinancialLedgerEntry[]>([]);
  useEffect(() => {
    const query = type ? `transaction_type=${encodeURIComponent(type)}` : "";
    fetchFinancialLedger(query).then((data) => setItems(data.results)).catch(() => setItems([]));
  }, [type]);
  return (
    <FinancialPageShell title={t("ledger")} description={t("cannotDeleteFinancialHistory")} testId="admin-financial-ledger">
      <FinancialFilters status={type} onStatus={setType} statuses={["deposit", "withdrawal", "payment", "refund", "escrow", "release", "platform_fee"]} />
      <LedgerTable items={items} locale={params.locale || "en"} />
    </FinancialPageShell>
  );
}
