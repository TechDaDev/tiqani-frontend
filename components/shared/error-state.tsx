"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
      role="alert"
    >
      <AlertTriangle className="mb-4 h-12 w-12 text-danger" />
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <p className="mt-1 mb-4 text-sm text-foreground-muted">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} size="sm">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
