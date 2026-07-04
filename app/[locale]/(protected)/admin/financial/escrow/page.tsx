"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FinancialFilters } from "@/components/admin/financial/financial-filters";
import { EscrowTable } from "@/components/admin/financial/escrow-table";
import { fetchFinancialEscrow } from "@/lib/api/admin-financial";
import type { AdminFinancialEscrow } from "@/lib/admin/financial/types";

export default function FinancialEscrowPage() {
  const t = useTranslations("admin.financial");
  const params = useParams<{ locale: string }>();
  const [status, setStatus] = useState("");
  const [items, setItems] = useState<AdminFinancialEscrow[]>([]);
  useEffect(() => {
    const query = status ? `status=${encodeURIComponent(status)}` : "";
    fetchFinancialEscrow(query).then((data) => setItems(data.results)).catch(() => setItems([]));
  }, [status]);
  return (
    <div className="space-y-4" data-testid="admin-financial-escrow">
      <h1 className="text-2xl font-semibold">{t("escrow")}</h1>
      <FinancialFilters status={status} onStatus={setStatus} statuses={["pending", "processing", "completed", "failed", "reversed"]} />
      <EscrowTable items={items} locale={params.locale || "en"} />
    </div>
  );
}
