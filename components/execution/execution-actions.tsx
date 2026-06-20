/**
 * Execution action buttons — role-specific, duplicate-click protected.
 */
"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import type { ContractExecutionStatus } from "@/lib/execution/types";
import { CONTRACT_EXECUTION_STATUS } from "@/lib/execution/types";

interface ExecutionActionsProps {
  status: ContractExecutionStatus;
  isClient: boolean;
  milestoneCount: number;
  onActivate?: () => Promise<void>;
  onRequestCompletion?: (message: string) => Promise<void>;
  onConfirmCompletion?: () => Promise<void>;
  onRejectCompletion?: (reason: string) => Promise<void>;
  className?: string;
}

export function ExecutionActions({
  status,
  isClient,
  milestoneCount,
  onActivate,
  onRequestCompletion,
  onConfirmCompletion,
  onRejectCompletion,
  className = "",
}: ExecutionActionsProps) {
  const t = useTranslations("execution");
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = useCallback(
    async (action: string, fn?: () => Promise<void>) => {
      if (!fn || loading) return;
      setLoading(action);
      try {
        await fn();
      } finally {
        setLoading(null);
      }
    },
    [loading],
  );

  const canActivate =
    isClient &&
    status === CONTRACT_EXECUTION_STATUS.IN_PROGRESS &&
    milestoneCount > 0;

  const canRequestCompletion =
    !isClient && status === CONTRACT_EXECUTION_STATUS.ACTIVE;

  const canConfirm =
    isClient && status === CONTRACT_EXECUTION_STATUS.COMPLETION_REQUESTED;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {canActivate && onActivate && (
        <button
          onClick={() => handleAction("activate", onActivate)}
          disabled={loading === "activate"}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          aria-busy={loading === "activate"}
        >
          {loading === "activate" ? t("activating") : t("activate")}
        </button>
      )}

      {canConfirm && onConfirmCompletion && (
        <button
          onClick={() => handleAction("confirm", onConfirmCompletion)}
          disabled={loading === "confirm"}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          aria-busy={loading === "confirm"}
        >
          {loading === "confirm" ? t("completing") : t("confirmCompletion")}
        </button>
      )}

      {canConfirm && onRejectCompletion && (
        <button
          onClick={() => handleAction("reject", () => onRejectCompletion(""))}
          disabled={loading === "reject"}
          className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-700 dark:bg-transparent dark:text-red-400"
          aria-busy={loading === "reject"}
        >
          {t("rejectCompletion")}
        </button>
      )}

      {canRequestCompletion && onRequestCompletion && (
        <button
          onClick={() => handleAction("request", () => onRequestCompletion(t("completionDefaultMessage") || ""))}
          disabled={loading === "request"}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          aria-busy={loading === "request"}
        >
          {loading === "request" ? t("requestingCompletion") : t("requestCompletion")}
        </button>
      )}
    </div>
  );
}
