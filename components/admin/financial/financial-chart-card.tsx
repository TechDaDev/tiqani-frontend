import type { FinancialChartItem } from "@/lib/admin/financial/types";

export function FinancialChartCard({ title, items }: { title: string; items: FinancialChartItem[] }) {
  const max = Math.max(...items.map((item) => Number(item.value) || item.count || 0), 1);
  return (
    <section className="rounded-md border bg-white p-4">
      <h2 className="text-sm font-semibold text-gray-950">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">No financial activity yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => {
            const value = Number(item.value) || item.count || 0;
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{item.label}</span>
                  <span>{value}</span>
                </div>
                <div className="h-2 rounded bg-gray-100">
                  <div className="h-2 rounded bg-blue-600" style={{ width: `${Math.max(4, (value / max) * 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
