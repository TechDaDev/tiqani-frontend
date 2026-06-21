"use client";

import { useTranslations } from "next-intl";

interface Props {
  balance: string;
  currency?: string;
  isLoading?: boolean;
}

export function WalletBalanceCard({ balance, currency = "IQD", isLoading }: Props) {
  const t = useTranslations("wallet");

  if (isLoading) {
    return <div className="animate-pulse rounded-lg bg-gray-100 p-6 h-24" />;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-600">{t("totalBalance")}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900" aria-label={`${t("totalBalance")}: ${balance} ${currency}`}>
        {balance} <span className="text-sm font-normal text-gray-500">{currency}</span>
      </p>
    </div>
  );
}
