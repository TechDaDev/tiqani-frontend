/**
 * Money display component — safe decimal rendering for IQD.
 */
import { useTranslations } from "next-intl";

interface MoneyDisplayProps {
  amount: string | number;
  currency?: string;
  className?: string;
}

export function MoneyDisplay({ amount, currency = "IQD", className = "" }: MoneyDisplayProps) {
  const t = useTranslations("offers");
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  return (
    <span className={`font-semibold tabular-nums ${className}`} dir="ltr">
      {numAmount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}{" "}
      {t("currency")}
    </span>
  );
}
