"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { isTechnician } from "@/lib/auth/guards";
import { FundingSummary } from "@/components/payments/funding-summary";
import { FundingAction } from "@/components/payments/funding-action";
import { formatIQD } from "@/lib/payments/money";
import {
  getFundingEligibility,
  createPaymentIntent,
  getContractFundingStatus,
  sandboxConfirmPayment,
} from "@/lib/api/payments";
import type {
  FundingEligibility,
  ContractFundingStatus,
  PaymentIntent,
} from "@/lib/payments/types";
import type { Locale } from "@/lib/i18n/routing";

export default function ContractFundingPage() {
  const params = useParams();
  const contractId = params.contractId as string;
  const t = useTranslations("funding");
  const tCommon = useTranslations("common");

  const [eligibility, setEligibility] = useState<FundingEligibility | null>(null);
  const [fundingStatus, setFundingStatus] = useState<ContractFundingStatus | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [result, setResult] = useState<"success" | "failure" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [elig, status] = await Promise.all([
        getFundingEligibility(contractId),
        getContractFundingStatus(contractId),
      ]);
      setEligibility(elig);
      setFundingStatus(status);
      // If there's already a pending intent, populate paymentIntent for sandbox confirm
      const activeIntent = (status as Record<string, unknown>)?.active_intent as Record<string, unknown> | undefined;
      if (activeIntent && !paymentIntent) {
        setPaymentIntent(activeIntent as unknown as PaymentIntent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("loadingError"));
    } finally {
      setIsLoading(false);
    }
  }, [contractId, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStartFunding = async (): Promise<PaymentIntent> => {
    const intent = await createPaymentIntent(contractId);
    setPaymentIntent(intent);
    // Refresh status
    const status = await getContractFundingStatus(contractId);
    setFundingStatus(status);
    return intent;
  };

  const handleSandboxConfirm = async (simulateFailure: boolean) => {
    if (!paymentIntent) return;
    setIsConfirming(true);
    setConfirmError(null);
    setResult(null);
    try {
      await sandboxConfirmPayment(paymentIntent.id, simulateFailure);
      setResult(simulateFailure ? "failure" : "success");
      const status = await getContractFundingStatus(contractId);
      setFundingStatus(status);
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : t("confirmError"));
    } finally {
      setIsConfirming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <Card className="border-danger-soft bg-danger-soft/10">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-danger" aria-hidden="true" />
            <p className="mt-2 text-sm text-danger" role="alert">{error}</p>
            <Button onClick={fetchData} variant="outline" className="mt-4">
              {tCommon("retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user } = useAuth();
  const currentUserIsTechnician = user ? isTechnician(user.role as Parameters<typeof isTechnician>[0]) : false;

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <h1 className="text-2xl font-bold text-foreground">{t("fundContract")}</h1>

      {fundingStatus && (
        <FundingSummary fundingStatus={fundingStatus} isTechnician={currentUserIsTechnician} />
      )}

      {eligibility && !eligibility.eligible && fundingStatus?.funding_status !== "funded" && (
        <Card className="border-warning-soft bg-warning-soft/10">
          <CardContent className="p-4">
            <p className="text-sm text-warning">{eligibility.reason}</p>
          </CardContent>
        </Card>
      )}

      {eligibility?.eligible && (
        <Card className="border-border-warm bg-surface-pure">
          <CardHeader>
            <CardTitle className="text-lg">{t("paymentDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-muted">{t("agreedAmount")}</span>
              <span className="text-sm font-medium text-foreground">
                {eligibility.agreed_amount ? formatIQD(eligibility.agreed_amount) : "-"}
              </span>
            </div>
            {eligibility.client_service_fee && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">{t("serviceFee")}</span>
                <span className="text-sm text-foreground-muted">
                  {formatIQD(eligibility.client_service_fee)}
                </span>
              </div>
            )}
            {eligibility.client_total_amount && (
              <div className="flex items-center justify-between border-t border-border-warm pt-3">
                <span className="text-sm font-semibold text-foreground">{t("totalAmount")}</span>
                <span className="text-sm font-bold text-foreground">
                  {formatIQD(eligibility.client_total_amount)}
                </span>
              </div>
            )}
            <div className="rounded-lg bg-surface-warm p-3">
              <p className="text-xs text-foreground-muted">
                {t("sandboxNotice")}
              </p>
            </div>
            <FundingAction
              contractId={contractId}
              fundingStatus={eligibility.funding_status}
              onStartFunding={handleStartFunding}
            />
          </CardContent>
        </Card>
      )}

      {paymentIntent && result === null && (
        <Card className="border-border-warm bg-surface-pure">
          <CardHeader>
            <CardTitle className="text-lg">{t("confirmPayment")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground-muted">{t("sandboxConfirmNotice")}</p>
            {confirmError && (
              <p className="text-sm text-danger" role="alert">{confirmError}</p>
            )}
            <div className="flex gap-3">
              <Button
                onClick={() => handleSandboxConfirm(true)}
                disabled={isConfirming}
                variant="outline"
                className="flex-1"
              >
                {isConfirming ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  t("simulateFailure")
                )}
              </Button>
              <Button
                onClick={() => handleSandboxConfirm(false)}
                disabled={isConfirming}
                className="flex-1"
              >
                {isConfirming ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  t("simulateSuccess")
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {result === "success" && (
        <Card className="border-success-soft bg-success-soft/10">
          <CardContent className="p-6 text-center">
            <CheckCircle className="mx-auto h-10 w-10 text-success" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-semibold text-success">{t("fundingSuccess")}</h2>
            <p className="mt-1 text-sm text-foreground-muted">{t("fundingSuccessDesc")}</p>
            <p className="mt-4 text-xs text-foreground-muted">{t("fundsNotReleased")}</p>
          </CardContent>
        </Card>
      )}

      {result === "failure" && (
        <Card className="border-danger-soft bg-danger-soft/10">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-danger" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-semibold text-danger">{t("fundingFailed")}</h2>
            <p className="mt-1 text-sm text-foreground-muted">{t("fundingFailedDesc")}</p>
            <Button onClick={fetchData} variant="outline" className="mt-4">
              {tCommon("retry")}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
