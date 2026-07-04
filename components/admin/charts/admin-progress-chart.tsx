import { AdminChartCard } from "./admin-chart-card";
import type { AdminChartItem } from "./types";

export function AdminProgressChart({
  title,
  description,
  items,
  total,
  totalLabel,
  emptyLabel,
}: {
  title: string;
  description?: string;
  items: AdminChartItem[];
  total: number;
  totalLabel?: string;
  emptyLabel: string;
}) {
  const isEmpty = total <= 0 || items.every((item) => item.value <= 0);

  return (
    <AdminChartCard
      title={title}
      description={description}
      total={total}
      totalLabel={totalLabel}
      emptyLabel={emptyLabel}
      isEmpty={isEmpty}
    >
      <div className="space-y-4">
        {items.map((item) => {
          const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-foreground-muted">{item.label}</span>
                <span className="font-medium tabular-nums text-foreground">{percent}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted" aria-label={`${item.label}: ${item.value}`}>
                <div
                  className={`h-full rounded-full ${item.className ?? "bg-primary"}`}
                  style={{ width: `${percent}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AdminChartCard>
  );
}
