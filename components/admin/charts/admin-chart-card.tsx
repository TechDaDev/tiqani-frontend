import type { ReactNode } from "react";

export function AdminChartCard({
  title,
  description,
  total,
  totalLabel,
  emptyLabel,
  isEmpty,
  children,
}: {
  title: string;
  description?: string;
  total?: number;
  totalLabel?: string;
  emptyLabel: string;
  isEmpty: boolean;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm" data-testid="admin-chart-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description ? <p className="mt-1 text-xs leading-5 text-foreground-muted">{description}</p> : null}
        </div>
        {totalLabel ? (
          <div className="shrink-0 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground-muted">
            <span>{totalLabel}</span>
            <span className="ms-1 font-semibold text-foreground tabular-nums">{total ?? 0}</span>
          </div>
        ) : null}
      </div>
      <div className="mt-5">
        {isEmpty ? (
          <div className="grid min-h-32 place-items-center rounded-md border border-dashed border-border bg-background/60 p-6 text-center text-sm text-foreground-muted">
            {emptyLabel}
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
