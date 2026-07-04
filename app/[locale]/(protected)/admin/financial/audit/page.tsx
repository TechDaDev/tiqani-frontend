"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FinancialAuditTable } from "@/components/admin/financial/financial-audit-table";
import { fetchFinancialAudit } from "@/lib/api/admin-financial";
import type { AdminFinancialAuditEvent } from "@/lib/admin/financial/types";

export default function FinancialAuditPage() {
  const t = useTranslations("admin.financial");
  const params = useParams<{ locale: string }>();
  const [items, setItems] = useState<AdminFinancialAuditEvent[]>([]);
  useEffect(() => {
    fetchFinancialAudit().then((data) => setItems(data.results)).catch(() => setItems([]));
  }, []);
  return (
    <div className="space-y-4" data-testid="admin-financial-audit">
      <h1 className="text-2xl font-semibold">{t("audit")}</h1>
      <p className="text-sm text-gray-500">{t("readOnly")}</p>
      <FinancialAuditTable items={items} locale={params.locale || "en"} />
    </div>
  );
}
