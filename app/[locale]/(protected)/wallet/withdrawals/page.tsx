"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { WithdrawalRequest } from "@/lib/withdrawals/types";
import { getWithdrawalStatusLabel, getWithdrawalStatusColor } from "@/lib/withdrawals/status";

export default function WithdrawalsPage() {
  const t = useTranslations("withdrawals");
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchWithdrawals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/wallet/withdrawals/");
      if (res.ok) setWithdrawals(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWithdrawals(); }, [fetchWithdrawals]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch("/api/wallet/withdrawals/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, notes }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed");
      }
      setAmount("");
      setNotes("");
      await fetchWithdrawals();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Error");
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const res = await fetch(`/api/wallet/withdrawals/${id}/cancel/`, { method: "POST" });
      if (res.ok) await fetchWithdrawals();
    } catch {}
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <Link href="/wallet" className="text-sm text-blue-600 hover:underline">{t("backToWallet")}</Link>
      </div>

      <form onSubmit={handleCreate} className="rounded-lg border p-4 space-y-3">
        <h2 className="text-sm font-semibold">{t("newRequest")}</h2>
        <div>
          <label className="block text-xs text-gray-600">{t("amount")}</label>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm"
            required
            placeholder="1000.00"
            aria-label={t("amount")}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">{t("notes")}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm"
            rows={2}
            aria-label={t("notes")}
          />
        </div>
        {createError && <p className="text-xs text-red-600" role="alert">{createError}</p>}
        <button
          type="submit"
          disabled={creating || !amount}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {creating ? t("submitting") : t("submitRequest")}
        </button>
      </form>

      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1,2].map(i => <div key={i} className="h-16 rounded bg-gray-100" />)}
        </div>
      ) : withdrawals.length === 0 ? (
        <p className="text-sm text-gray-500">{t("empty")}</p>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-lg border">
          {withdrawals.map((wr) => (
            <li key={wr.id} className="flex items-center justify-between p-3">
              <div>
                <Link href={`/wallet/withdrawals/${wr.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                  {wr.amount} IQD
                </Link>
                <span className={`ml-2 inline-block rounded px-2 py-0.5 text-xs font-medium ${getWithdrawalStatusColor(wr.status)}`}>
                  {getWithdrawalStatusLabel(wr.status)}
                </span>
              </div>
              <div className="flex gap-2">
                {(wr.status === "pending" || wr.status === "approved") && (
                  <button onClick={() => handleCancel(wr.id)} className="text-xs text-red-600 hover:underline">{t("cancel")}</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
