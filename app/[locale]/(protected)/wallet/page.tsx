"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { WalletBalanceCard } from "@/components/wallet/wallet-balance-card";
import { AvailableBalanceCard } from "@/components/wallet/available-balance-card";
import { WalletRechargePanel } from "@/components/wallet/recharge-panel";
import type { WalletInfo, AvailableBalance } from "@/lib/wallet/types";
import { mapAvailableBalance } from "@/lib/wallet/mappers";

export default function WalletPage() {
  const t = useTranslations("wallet");
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [balance, setBalance] = useState<AvailableBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [walletRes, balanceRes] = await Promise.all([
        fetch("/api/wallet/me/"),
        fetch("/api/wallet/available-balance/"),
      ]);
      if (!walletRes.ok || !balanceRes.ok) {
        throw new Error("Failed to fetch wallet data");
      }
      const walletData = await walletRes.json();
      const balanceData = await balanceRes.json();
      setWallet(walletData);
      setBalance(mapAvailableBalance(balanceData));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (error) {
    return (
      <div className="p-6" role="alert">
        <p className="text-red-600">{t("errorLoading")}</p>
        <button onClick={fetchData} className="mt-2 text-sm text-blue-600 hover:underline">{t("retry")}</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">{t("myWallet")}</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {wallet && <WalletBalanceCard balance={wallet.balance} isLoading={loading} />}
        {balance && (
          <AvailableBalanceCard
            totalBalance={balance.total_balance}
            reservedBalance={balance.reserved_balance}
            availableBalance={balance.available_balance}
            isLoading={loading}
          />
        )}
      </div>
      <nav className="flex gap-4">
        <Link
          href="/wallet/transactions"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {t("viewTransactions")}
        </Link>
        <Link
          href="/wallet/withdrawals"
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          {t("withdrawals")}
        </Link>
      </nav>
      <WalletRechargePanel onChanged={fetchData} />
    </div>
  );
}
