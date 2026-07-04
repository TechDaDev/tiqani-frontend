import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const surfaceClass =
  "rounded-lg border border-border bg-surface p-4 shadow-sm shadow-black/10";

export function FinancialPageShell({
  title,
  description,
  children,
  testId,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  testId?: string;
}) {
  return (
    <div className="space-y-5 text-foreground" data-testid={testId}>
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description ? <p className="mt-1 text-sm text-foreground-muted">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function FinancialSectionCard({
  children,
  className,
  testId,
}: {
  children: ReactNode;
  className?: string;
  testId?: string;
}) {
  return (
    <section className={cn(surfaceClass, className)} data-testid={testId}>
      {children}
    </section>
  );
}

export function FinancialTabLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-primary bg-primary text-background shadow-sm shadow-primary/20"
          : "border-border bg-surface text-foreground-muted hover:border-primary hover:bg-primary-soft hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export function FinancialEmptyState({ children = "No financial activity yet." }: { children?: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-background/50 p-4 text-sm text-foreground-muted">
      {children}
    </div>
  );
}

export function FinancialTableShell({
  children,
  ariaLabel,
}: {
  children: ReactNode;
  ariaLabel: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-sm shadow-black/10">
      <table className="min-w-full divide-y divide-border text-sm text-foreground" aria-label={ariaLabel}>
        {children}
      </table>
    </div>
  );
}

export const financialTableHeadClass =
  "bg-surface-subtle text-left text-xs uppercase text-foreground-muted";
export const financialTableBodyClass = "divide-y divide-border";
export const financialTableRowClass = "transition-colors hover:bg-primary-soft/30";
export const financialTableCellClass = "px-3 py-2 align-top";
export const financialTableMonoCellClass = cn(financialTableCellClass, "font-mono text-xs text-foreground");
