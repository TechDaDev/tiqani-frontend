"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { WithdrawalRequest } from "@/lib/withdrawals/types";
import { getWithdrawalStatusLabel, getWithdrawalStatusColor } from "@/lib/withdrawals/status";
import { canStaffApprove, canStaffReject, canStaffProcess, canStaffConfirmPayout, canStaffRetryPayout } from "@/lib/withdrawals/actions";

export default function AdminWithdrawalDetailPage() {
  const params = useParams();
  const withdrawalId = params.withdrawalId as string;
  const t = useTranslations("adminWithdrawals");
  const [wr, setWr] = useState<WithdrawalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wallet/withdrawals/${withdrawalId}/`);
      if (res.ok) setWr(await res.json());
    } finally { setLoading(false); }
  }, [withdrawalId]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  const handleAction = async (action: string, extra?: Record<string, unknown>) => {
    setActionMsg(null);
    try {
      const res = await fetch(`/api/admin/withdrawals/${withdrawalId}/${action}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extra ?? {}),
      });
      if (res.ok) {
        setActionMsg(`${action} successful`);
        await fetchDetail();
      } else {
        const data = await res.json();
        setActionMsg(data.detail || `${action} failed`);
      }
    } catch {
      setActionMsg("Request failed");
    }
  };

  if (loading) return <div className="p-6"><div className="h-32 animate-pulse rounded bg-gray-100" /></div>;
  if (!wr) return <div className="p-6 text-gray-500">Not found</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <Link href="/admin/withdrawals" className="text-sm text-blue-600 hover:underline">&larr; {t("all")}</Link>
      <h1 className="text-2xl font-bold text-gray-900">{t("detail")}</h1>
      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex justify-between"><span className="text-gray-600">Amount</span><span className="font-mono">{wr.amount} {wr.currency}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">Status</span><span className={`rounded px-2 py-0.5 text-xs font-medium ${getWithdrawalStatusColor(wr.status)}`}>{getWithdrawalStatusLabel(wr.status)}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">User</span><span className="text-sm">{wr.user}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">Created</span><span className="text-sm">{new Date(wr.created_at).toLocaleString()}</span></div>
        {wr.admin_note && <div className="flex justify-between"><span className="text-gray-600">Admin Note</span><span className="text-sm">{wr.admin_note}</span></div>}
        {wr.failure_message && <div className="rounded bg-red-50 p-2 text-xs text-red-700">{wr.failure_message}</div>}
      </div>

      {actionMsg && (
        <div className={`rounded p-3 text-sm ${actionMsg.includes("successful") ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`} role="alert">
          {actionMsg}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {wr && canStaffApprove(wr.status) && (
          <button onClick={() => handleAction("approve", { admin_note: "Approved by admin" })} className="rounded bg-green-100 px-3 py-1.5 text-sm text-green-800 hover:bg-green-200">Approve</button>
        )}
        {wr && canStaffReject(wr.status) && (
          <button onClick={() => handleAction("reject", { admin_note: "Rejected by admin" })} className="rounded bg-red-100 px-3 py-1.5 text-sm text-red-800 hover:bg-red-200">Reject</button>
        )}
        {wr && canStaffProcess(wr.status) && (
          <button onClick={() => handleAction("process")} className="rounded bg-blue-100 px-3 py-1.5 text-sm text-blue-800 hover:bg-blue-200">Process</button>
        )}
        {wr && canStaffConfirmPayout(wr.status) && (
          <button onClick={() => handleAction("sandbox-confirm", { simulate_failure: false })} className="rounded bg-indigo-100 px-3 py-1.5 text-sm text-indigo-800 hover:bg-indigo-200">Confirm Payout</button>
        )}
        {wr && canStaffRetryPayout(wr.status) && (
          <button onClick={() => handleAction("retry", { simulate_failure: false })} className="rounded bg-yellow-100 px-3 py-1.5 text-sm text-yellow-800 hover:bg-yellow-200">Retry</button>
        )}
      </div>
    </div>
  );
}
