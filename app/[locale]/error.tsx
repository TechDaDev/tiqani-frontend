"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer } from "@/components/shared/responsive-container";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <ResponsiveContainer>
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-foreground-muted">
            An unexpected error occurred. Please try again.
          </p>
          <Button onClick={reset} variant="primary" className="mt-6">
            Try again
          </Button>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
