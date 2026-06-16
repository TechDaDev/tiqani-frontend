"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Loader2, Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useClientOfferDetail, acceptOffer, rejectOffer } from "@/lib/offers/query";
import { OfferStatusBadge } from "@/components/offers/offer-status-badge";
import { MoneyDisplay } from "@/components/offers/money-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n/routing";

export default function ClientOfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as Locale) || "ar";
  const offerId = params.offerId as string;
  const t = useTranslations("offers");
  const tActions = useTranslations("offerActions");
  const tCommon = useTranslations("common");

  const { data: offer, isLoading, error, refetch } = useClientOfferDetail(offerId);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">{t("offerErrors.notFound")}</p>
        <Link href={`/${locale}/offers`} className="mt-4 inline-flex items-center text-sm text-primary hover:underline">
          <ArrowRight className="ml-1 h-4 w-4" />
          {tCommon("back")}
        </Link>
      </div>
    );
  }

  const handleAccept = async () => {
    if (!confirm(t("acceptConfirm"))) return;
    setActionLoading(true);
    setErrorMsg(null);
    try {
      const result = await acceptOffer(offerId);
      refetch();
      if (result.contract_id) {
        router.push(`/${locale}/contracts/${result.contract_id}`);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t("offerErrors.acceptFailed"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm(t("rejectConfirm"))) return;
    setActionLoading(true);
    setErrorMsg(null);
    try {
      await rejectOffer(offerId);
      refetch();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t("offerErrors.rejectFailed"));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/${locale}/offers`}
        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowRight className="ml-1 h-4 w-4 rtl:rotate-180" />
        {t("incomingOffers")}
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("offerDetail")}</CardTitle>
          <OfferStatusBadge status={offer.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{t("technician")}</p>
            <p className="font-medium">{offer.technician?.full_name}</p>
            {offer.technician?.job_title && (
              <p className="text-sm text-muted-foreground">{offer.technician.job_title}</p>
            )}
          </div>
          {offer.request_title && (
            <div>
              <p className="text-sm text-muted-foreground">{t("serviceRequest")}</p>
              <p className="font-medium">{offer.request_title}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">{t("amount")}</p>
            <MoneyDisplay amount={offer.amount} className="text-lg" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
            <p className="whitespace-pre-wrap text-sm">{offer.description}</p>
          </div>
          {offer.duration_days && (
            <div>
              <p className="text-sm text-muted-foreground">{t("duration")}</p>
              <p className="font-medium">{offer.duration_days} days</p>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {errorMsg}
            </div>
          )}

          {offer.status === "SUBMITTED" && (
            <div className="flex items-center gap-3 pt-4">
              <Button onClick={handleAccept} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {tActions("accept")}
              </Button>
              <Button onClick={handleReject} disabled={actionLoading} variant="outline">
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                {tActions("reject")}
              </Button>
            </div>
          )}

          {offer.status === "ACCEPTED" && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
              {tActions("contractCreated")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
