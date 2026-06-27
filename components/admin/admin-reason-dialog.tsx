"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  label: string;
  title: string;
  confirmLabel: string;
  onConfirm: (reason: string) => Promise<void>;
  variant?: "danger" | "neutral";
};

export function AdminReasonDialog({ label, title, confirmLabel, onConfirm, variant = "neutral" }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const reasonId = useId();

  async function submit() {
    const trimmed = reason.trim();
    if (!trimmed) {
      setError("Reason required.");
      return;
    }
    setPending(true);
    setError("");
    try {
      await onConfirm(trimmed);
      setOpen(false);
      setReason("");
    } catch {
      setError("Action failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant={variant === "danger" ? "danger" : "outline"}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${reasonId}-title`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="w-full max-w-md rounded-lg bg-card p-5 shadow-xl">
            <h2 id={`${reasonId}-title`} className="text-lg font-semibold">
              {title}
            </h2>
            <label htmlFor={reasonId} className="mt-4 block text-sm font-medium">
              Reason
            </label>
            <textarea
              id={reasonId}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-2 min-h-24 w-full rounded-md border border-border bg-background p-3 text-sm"
              aria-describedby={error ? `${reasonId}-error` : undefined}
            />
            {error && (
              <p id={`${reasonId}-error`} className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
                Cancel
              </Button>
              <Button type="button" onClick={submit} disabled={pending}>
                {pending ? "Working..." : confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
