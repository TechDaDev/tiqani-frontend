"use client";

import { cn } from "@/lib/utils";

export function FinancialFilters({
  status,
  onStatus,
  statuses,
}: {
  status: string;
  onStatus: (status: string) => void;
  statuses: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {["", ...statuses].map((item) => (
        <button
          key={item || "all"}
          type="button"
          onClick={() => onStatus(item)}
          className={cn(
            "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            status === item
              ? "border-primary bg-primary text-background shadow-sm shadow-primary/20"
              : "border-border bg-surface text-foreground-muted hover:border-primary hover:bg-primary-soft hover:text-foreground",
          )}
        >
          {item || "All"}
        </button>
      ))}
    </div>
  );
}
