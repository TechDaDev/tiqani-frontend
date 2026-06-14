import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
  className?: string;
};

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      <PackageOpen className="mb-4 h-12 w-12 text-foreground-muted" />
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-foreground-muted">{description}</p>
      )}
    </div>
  );
}
