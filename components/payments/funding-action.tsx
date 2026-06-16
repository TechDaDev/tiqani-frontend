"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { canStartFunding } from "@/lib/payments/status";
import type { FundingStatus, PaymentIntent } from "@/lib/payments/types";

interface Props {
  contractId: string;
  fundingStatus: FundingStatus;
  onStartFunding: () => Promise<PaymentIntent>;
  disabled?: boolean;
}

export function FundingAction({
  contractId,
  fundingStatus,
  onStartFunding,
  disabled = false,
}: Props) {
  const t = useTranslations("funding");
  const [isPending, setIsPending] = useState(false);
  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!canStartFunding(fundingStatus) && !intent) return null;

  const handleStart = async () => {
    setIsPending(true);
    setError(null);
    try {
      const result = await onStartFunding();
      setIntent(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("fundingError"));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-3">
      {!intent && (
        <Button
          onClick={handleStart}
          disabled={isPending || disabled}
          size="lg"
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>{t("starting")}</span>
            </>
          ) : (
            <span>{t("startFunding")}</span>
          )}
        </Button>
      )}
      {intent && (
        <div className="rounded-lg border border-success-soft bg-success-soft/30 p-3 text-center">
          <p className="text-sm font-medium text-success">
            {t("intentCreated")}
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            {t("completePayment")}
          </p>
        </div>
      )}
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
