"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FinancialAuditTable } from "@/components/admin/financial/financial-audit-table";
import { FinancialPageShell } from "@/components/admin/financial/financial-theme";
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
    <FinancialPageShell title={t("audit")} description={t("readOnly")} testId="admin-financial-audit">
      <FinancialAuditTable items={items} locale={params.locale || "en"} />
    </FinancialPageShell>
  );
}
