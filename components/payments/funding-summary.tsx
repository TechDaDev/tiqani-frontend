"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIQD } from "@/lib/payments/money";
import { PaymentStatusBadge } from "./payment-status-badge";
import type { ContractFundingStatus } from "@/lib/payments/types";

interface Props {
  fundingStatus: ContractFundingStatus;
  isTechnician: boolean;
}

export function FundingSummary({ fundingStatus, isTechnician }: Props) {
  const t = useTranslations("funding");

  return (
    <Card className="border-border-warm bg-surface-pure">
      <CardHeader>
        <CardTitle className="text-lg">{t("fundingStatus")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground-muted">{t("status")}</span>
          <PaymentStatusBadge status={fundingStatus.funding_status} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground-muted">{t("agreedAmount")}</span>
          <span className="text-sm font-medium text-foreground">
            {fundingStatus.agreed_amount ? formatIQD(fundingStatus.agreed_amount) : "-"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground-muted">{t("escrowHeld")}</span>
          <span className="text-sm font-medium text-foreground">
            {formatIQD(fundingStatus.escrow_amount)}
          </span>
        </div>
        {!isTechnician && (
          <p className="mt-2 text-xs text-foreground-muted">
            {t("fundsNotReleased")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
