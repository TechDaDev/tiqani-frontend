"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { WithdrawalRequest } from "@/lib/withdrawals/types";
import { getWithdrawalStatusLabel, getWithdrawalStatusColor } from "@/lib/withdrawals/status";

export default function WithdrawalDetailPage() {
  const params = useParams();
  const withdrawalId = params.withdrawalId as string;
  const t = useTranslations("withdrawals");
  const [wr, setWr] = useState<WithdrawalRequest | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/wallet/withdrawals/${withdrawalId}/`);
      if (res.ok) setWr(await res.json());
    } finally { setLoading(false); }
  }, [withdrawalId]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  if (loading) return <div className="p-6 animate-pulse h-32 bg-gray-100 rounded" />;
  if (!wr) return <div className="p-6 text-gray-500">{t("notFound")}</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <Link href="/wallet/withdrawals" className="text-sm text-blue-600 hover:underline">&larr; {t("back")}</Link>
      <h1 className="text-2xl font-bold text-gray-900">{t("withdrawalDetail")}</h1>
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex justify-between"><span className="text-gray-600">{t("amount")}</span><span className="font-mono">{wr.amount} {wr.currency}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">{t("status")}</span><span className={`rounded px-2 py-0.5 text-xs font-medium ${getWithdrawalStatusColor(wr.status)}`}>{getWithdrawalStatusLabel(wr.status)}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">{t("createdAt")}</span><span className="text-sm">{new Date(wr.created_at).toLocaleString()}</span></div>
        {wr.admin_note && <div className="flex justify-between"><span className="text-gray-600">{t("adminNote")}</span><span className="text-sm">{wr.admin_note}</span></div>}
        {wr.failure_message && <div className="rounded bg-red-50 p-2 text-xs text-red-700">{wr.failure_message}</div>}
      </div>
    </div>
  );
}
