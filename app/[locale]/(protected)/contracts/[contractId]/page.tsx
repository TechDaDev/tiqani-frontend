"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Loader2, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { browserRequest } from "@/lib/api/browser-client";
import { ContractStatusBadge } from "@/components/contracts/contract-status-badge";
import { MoneyDisplay } from "@/components/offers/money-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { formatIQD } from "@/lib/payments/money";
import { canStartFunding } from "@/lib/payments/status";
import type { Phase6Contract } from "@/lib/contracts/types";
import type { Locale } from "@/lib/i18n/routing";
import type { ContractFundingStatus, FundingStatus } from "@/lib/payments/types";

function mapContract(raw: Record<string, unknown>): Phase6Contract {
  return {
    id: raw.id as string,
    contract_reference: raw.contract_reference as string,
    client: raw.client as Phase6Contract["client"],
    technician: raw.technician as Phase6Contract["technician"],
    work_description: raw.work_description as string,
    agreed_amount: raw.agreed_amount as string,
    currency: raw.currency as string,
    status: raw.status as Phase6Contract["status"],
    client_accepted: raw.client_accepted as boolean,
    technician_accepted: raw.technician_accepted as boolean,
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
  };
}

export default function ContractDetailPage() {
  const params = useParams();
  const locale = (params.locale as Locale) || "ar";
  const contractId = params.contractId as string;
  const t = useTranslations("contracts");
  const tOffers = useTranslations("offers");
  const tCommon = useTranslations("common");
  const tFunding = useTranslations("funding");
  const tPayStatus = useTranslations("paymentStatus");

  const [contract, setContract] = useState<Phase6Contract | null | undefined>(undefined);
  const [funding, setFunding] = useState<ContractFundingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!contractId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [raw, fundingRaw] = await Promise.all([
        browserRequest<Record<string, unknown>>(`/api/contracts/${contractId}/`),
        browserRequest<Record<string, unknown>>(`/api/contracts/${contractId}/funding/status/`).catch(() => null),
      ]);
      setContract(raw ? mapContract(raw) : null);
      if (fundingRaw) {
        setFunding(fundingRaw as unknown as ContractFundingStatus);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load contract"));
    } finally {
      setIsLoading(false);
    }
  }, [contractId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const isClient = false; // Simplified — real impl uses auth context
  const fundStatus: FundingStatus = funding?.funding_status || "unfunded";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">{tOffers("offerErrors.notFound")}</p>
        <Link href={`/${locale}/offers`} className="mt-4 inline-flex items-center text-sm text-primary hover:underline">
          <ArrowRight className="ml-1 h-4 w-4" />
          {tCommon("back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("contractDetail")}</CardTitle>
            <p className="text-sm text-foreground-muted">{contract.contract_reference}</p>
          </div>
          <ContractStatusBadge status={contract.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-foreground-muted">{t("client")}</p>
            <p className="font-medium">{contract.client?.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-foreground-muted">{t("technician")}</p>
            <p className="font-medium">{contract.technician?.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-foreground-muted">{t("workDescription")}</p>
            <p className="whitespace-pre-wrap text-sm">{contract.work_description}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">{t("agreedAmount")}</p>
              <MoneyDisplay amount={contract.agreed_amount} className="text-lg" />
            </div>
            <div className="text-right">
              <p className="text-sm text-foreground-muted">{tFunding("fundingStatus")}</p>
              <PaymentStatusBadge status={fundStatus} />
            </div>
          </div>
          {funding && (
            <div className="flex items-center justify-between border-t border-border-warm pt-3">
              <div>
                <p className="text-sm text-foreground-muted">{tFunding("escrowHeld")}</p>
                <p className="font-medium">{formatIQD(funding.escrow_amount)}</p>
              </div>
              <p className="text-xs text-foreground-muted">{tFunding("fundsNotReleased")}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-foreground-muted">{t("createdAt")}</p>
            <p className="font-medium">{new Date(contract.created_at).toLocaleDateString()}</p>
          </div>

          {/* Funding action for client */}
          {isClient && canStartFunding(fundStatus) && (contract.status as string) === "in_progress" && (
            <Link href={`/${locale}/contracts/${contractId}/fund`}>
              <Button className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                {tFunding("fundContract")}
              </Button>
            </Link>
          )}

          {fundStatus === "funded" && (
            <div className="rounded-lg border border-success-soft bg-success-soft/30 p-3 text-sm text-success">
              <p>{tFunding("fundingSuccessDesc")}</p>
            </div>
          )}

          <div className="rounded-lg border border-border-warm bg-surface-warm p-3 text-sm text-foreground-muted">
            <p>{t("createdFromOffer")}</p>
            <p className="mt-1">{t("paymentNote")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
