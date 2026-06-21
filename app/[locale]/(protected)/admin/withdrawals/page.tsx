"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { WithdrawalRequest } from "@/lib/withdrawals/types";
import { getWithdrawalStatusLabel, getWithdrawalStatusColor } from "@/lib/withdrawals/status";
import { canStaffApprove, canStaffReject, canStaffProcess, canStaffConfirmPayout, canStaffRetryPayout } from "@/lib/withdrawals/actions";

export default function AdminWithdrawalsPage() {
  const t = useTranslations("adminWithdrawals");
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : "";
      const res = await fetch(`/api/admin/withdrawals/${params}`);
      if (res.ok) setWithdrawals(await res.json());
    } finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAction = async (id: string, action: string, extra?: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}/${action}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extra ?? {}),
      });
      if (res.ok) await fetchAll();
    } catch {}
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>

      <div className="flex flex-wrap gap-2">
        {["", "pending", "approved", "processing", "paid", "failed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded px-3 py-1 text-xs ${statusFilter === s ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}
          >
            {s ? getWithdrawalStatusLabel(s as any) : t("all")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded bg-gray-100" />)}
        </div>
      ) : withdrawals.length === 0 ? (
        <p className="text-sm text-gray-500">{t("empty")}</p>
      ) : (
        <div className="space-y-3">
          {withdrawals.map((wr) => (
            <div key={wr.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Link href={`/admin/withdrawals/${wr.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                    {wr.amount} {wr.currency}
                  </Link>
                  <span className={`ml-2 rounded px-2 py-0.5 text-xs font-medium ${getWithdrawalStatusColor(wr.status)}`}>
                    {getWithdrawalStatusLabel(wr.status)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{new Date(wr.created_at).toLocaleDateString()}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {canStaffApprove(wr.status) && (
                  <button onClick={() => handleAction(wr.id, "approve", { admin_note: "Approved by admin" })} className="rounded bg-green-100 px-2 py-1 text-xs text-green-800 hover:bg-green-200">
                    {t("approve")}
                  </button>
                )}
                {canStaffReject(wr.status) && (
                  <button onClick={() => handleAction(wr.id, "reject", { admin_note: "Rejected by admin" })} className="rounded bg-red-100 px-2 py-1 text-xs text-red-800 hover:bg-red-200">
                    {t("reject")}
                  </button>
                )}
                {canStaffProcess(wr.status) && (
                  <button onClick={() => handleAction(wr.id, "process")} className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 hover:bg-blue-200">
                    {t("process")}
                  </button>
                )}
                {canStaffConfirmPayout(wr.status) && (
                  <button onClick={() => handleAction(wr.id, "sandbox-confirm", { simulate_failure: false })} className="rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-800 hover:bg-indigo-200">
                    {t("confirmPayout")}
                  </button>
                )}
                {canStaffRetryPayout(wr.status) && (
                  <button onClick={() => handleAction(wr.id, "retry", { simulate_failure: false })} className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800 hover:bg-yellow-200">
                    {t("retry")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
