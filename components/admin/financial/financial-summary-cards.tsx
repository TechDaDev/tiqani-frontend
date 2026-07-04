import { MoneyCell } from "./money-cell";

type Item = { label: string; amount: string; currency?: string };

export function FinancialSummaryCards({ items, locale }: { items: Item[]; locale: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-md border bg-white p-4">
          <p className="text-xs font-medium uppercase text-gray-500">{item.label}</p>
          <p className="mt-2 text-xl font-semibold text-gray-950">
            <MoneyCell amount={item.amount} currency={item.currency} locale={locale} />
          </p>
        </div>
      ))}
    </div>
  );
}
