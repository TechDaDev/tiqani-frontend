import { MoneyCell } from "./money-cell";
import { FinancialSectionCard } from "./financial-theme";

type Item = { label: string; amount: string; currency?: string };

export function FinancialSummaryCards({ items, locale }: { items: Item[]; locale: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <FinancialSectionCard key={item.label} testId="financial-summary-card">
          <p className="text-xs font-medium uppercase text-foreground-muted">{item.label}</p>
          <p className="mt-2 text-xl font-semibold text-foreground">
            <MoneyCell amount={item.amount} currency={item.currency} locale={locale} />
          </p>
        </FinancialSectionCard>
      ))}
    </div>
  );
}
