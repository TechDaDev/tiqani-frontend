import { AdminChartCard } from "./admin-chart-card";
import type { AdminChartItem } from "./types";

export function AdminBarChart({
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
  total?: number;
  totalLabel?: string;
  emptyLabel: string;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  const isEmpty = items.every((item) => item.value <= 0);

  return (
    <AdminChartCard
      title={title}
      description={description}
      total={total}
      totalLabel={totalLabel}
      emptyLabel={emptyLabel}
      isEmpty={isEmpty}
    >
      <div className="space-y-3">
        {items.map((item) => {
          const width = Math.max((item.value / max) * 100, item.value > 0 ? 8 : 0);
          return (
            <div key={item.label} className="grid grid-cols-[minmax(6rem,9rem)_1fr_3rem] items-center gap-3 text-sm">
              <span className="truncate text-foreground-muted">{item.label}</span>
              <div className="h-3 overflow-hidden rounded-full bg-muted" aria-label={`${item.label}: ${item.value}`}>
                <div
                  className={`h-full rounded-full ${item.className ?? "bg-primary"}`}
                  style={{ width: `${width}%`, backgroundColor: item.color }}
                />
              </div>
              <span className="text-end font-medium tabular-nums text-foreground">{item.value}</span>
            </div>
          );
        })}
      </div>
    </AdminChartCard>
  );
}
