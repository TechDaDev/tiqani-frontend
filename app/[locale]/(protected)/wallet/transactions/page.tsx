"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { WalletTransaction, WalletTransactionType } from "@/lib/wallet/types";
import { getTransactionTypeLabel, getTransactionTypeColor } from "@/lib/wallet/status";

export default function TransactionsPage() {
  const t = useTranslations("walletTransactions");
  const walletT = useTranslations("wallet");
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("");

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = typeFilter ? `?transaction_type=${typeFilter}` : "";
      const res = await fetch(`/api/wallet/transactions/${params}`);
      if (!res.ok) throw new Error("Failed to load");
      setTransactions(await res.json());
    } catch {
      // handled by empty state
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <Link href="/wallet" className="text-sm text-blue-600 hover:underline">{walletT("backToWallet")}</Link>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTypeFilter("")} className={`rounded px-3 py-1 text-xs ${!typeFilter ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}>{t("all")}</button>
        <button onClick={() => setTypeFilter("release")} className={`rounded px-3 py-1 text-xs ${typeFilter === "release" ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}>{t("releases")}</button>
        <button onClick={() => setTypeFilter("withdrawal")} className={`rounded px-3 py-1 text-xs ${typeFilter === "withdrawal" ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}>{t("withdrawals")}</button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-12 rounded bg-gray-100" />)}
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-sm text-gray-500">{t("empty")}</p>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-lg border">
          {transactions.map((txn) => (
            <li key={txn.id} className="flex items-center justify-between p-3">
              <div>
                <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${getTransactionTypeColor(txn.transaction_type)}`}>
                  {getTransactionTypeLabel(txn.transaction_type)}
                </span>
                <p className="mt-1 text-xs text-gray-500">{txn.description}</p>
              </div>
              <span className="font-mono text-sm">{txn.amount} IQD</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
