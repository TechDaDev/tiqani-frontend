import { formatMoney } from "@/lib/admin/financial/format";

export function MoneyCell({ amount, currency = "IQD", locale = "en" }: { amount: string; currency?: string; locale?: string }) {
  return <span className="font-medium tabular-nums text-foreground">{formatMoney(amount, currency, locale)}</span>;
}
