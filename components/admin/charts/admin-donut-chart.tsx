import { AdminChartCard } from "./admin-chart-card";
import type { AdminChartItem } from "./types";

const fallbackColors = ["#14b8a6", "#38bdf8", "#f59e0b", "#a78bfa", "#94a3b8"];

export function AdminDonutChart({
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
  const isEmpty = items.every((item) => item.value <= 0);
  let cursor = 0;
  const segments = items.map((item, index) => {
    const share = total > 0 ? item.value / total : 0;
    const start = cursor;
    cursor += share;
    return {
      ...item,
      color: item.color ?? fallbackColors[index % fallbackColors.length],
      dasharray: `${share * 100} ${100 - share * 100}`,
      dashoffset: 25 - start * 100,
    };
  });

  return (
    <AdminChartCard
      title={title}
      description={description}
      total={total}
      totalLabel={totalLabel}
      emptyLabel={emptyLabel}
      isEmpty={isEmpty}
    >
      <div className="grid gap-5 sm:grid-cols-[8.5rem_1fr] sm:items-center">
        <svg viewBox="0 0 42 42" className="mx-auto h-32 w-32 -rotate-90" role="img" aria-label={title}>
          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--muted)" strokeWidth="6" />
          {segments.map((segment) => (
            <circle
              key={segment.label}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={segment.color}
              strokeWidth="6"
              strokeDasharray={segment.dasharray}
              strokeDashoffset={segment.dashoffset}
            />
          ))}
        </svg>
        <div className="space-y-2">
          {segments.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2 text-foreground-muted">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.label}</span>
              </span>
              <span className="font-medium tabular-nums text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminChartCard>
  );
}
