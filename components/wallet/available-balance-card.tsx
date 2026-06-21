"use client";

import { useTranslations } from "next-intl";

interface Props {
  totalBalance: string;
  reservedBalance: string;
  availableBalance: string;
  currency?: string;
  isLoading?: boolean;
}

export function AvailableBalanceCard({ totalBalance, reservedBalance, availableBalance, currency = "IQD", isLoading }: Props) {
  const t = useTranslations("wallet");

  if (isLoading) {
    return <div className="animate-pulse rounded-lg bg-gray-100 p-4 h-32" />;
  }

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex justify-between">
        <span className="text-sm text-gray-600">{t("totalBalance")}</span>
        <span className="font-mono text-sm font-medium">{totalBalance} {currency}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-600">{t("reservedBalance")}</span>
        <span className="font-mono text-sm text-yellow-700">{reservedBalance} {currency}</span>
      </div>
      <hr className="border-gray-200" />
      <div className="flex justify-between">
        <span className="text-sm font-semibold text-gray-900">{t("availableBalance")}</span>
        <span className="font-mono text-sm font-bold text-green-700">{availableBalance} {currency}</span>
      </div>
    </div>
  );
}
