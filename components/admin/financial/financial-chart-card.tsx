import type { FinancialChartItem } from "@/lib/admin/financial/types";
import { FinancialEmptyState, FinancialSectionCard } from "./financial-theme";

export function FinancialChartCard({ title, items }: { title: string; items: FinancialChartItem[] }) {
  const max = Math.max(...items.map((item) => Number(item.value) || item.count || 0), 1);
  return (
    <FinancialSectionCard testId="financial-chart-card">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {items.length === 0 ? (
        <div className="mt-4">
          <FinancialEmptyState />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => {
            const value = Number(item.value) || item.count || 0;
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between gap-3 text-xs text-foreground-muted">
                  <span>{item.label}</span>
                  <span className="font-medium tabular-nums text-foreground">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-background" aria-label={`${item.label}: ${value}`}>
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(4, (value / max) * 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </FinancialSectionCard>
  );
}
