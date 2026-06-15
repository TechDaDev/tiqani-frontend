"use client";

import { cn } from "@/lib/utils";

type AuthErrorProps = {
  message?: string;
  className?: string;
};

export function AuthError({ message, className }: AuthErrorProps) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border border-danger-soft bg-danger-soft/50 px-4 py-3 text-sm text-danger",
        className
      )}
    >
      {message}
    </div>
  );
}
