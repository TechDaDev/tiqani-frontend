"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Loader2, Check, X, Send, Ban } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTechnicianOfferDetail, submitOffer, withdrawOffer } from "@/lib/offers/query";
import { OfferStatusBadge } from "@/components/offers/offer-status-badge";
import { MoneyDisplay } from "@/components/offers/money-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n/routing";

export default function TechnicianOfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as Locale) || "ar";
  const offerId = params.offerId as string;
  const t = useTranslations("offers");
  const tActions = useTranslations("offerActions");
  const tCommon = useTranslations("common");

  const { data: offer, isLoading, error, refetch } = useTechnicianOfferDetail(offerId);
  const [actionLoading, setActionLoading] = useState(false);

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
        <Link href={`/${locale}/technician/offers`} className="mt-4 inline-flex items-center text-sm text-primary hover:underline">
          <ArrowRight className="ml-1 h-4 w-4" />
          {tCommon("back")}
        </Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!confirm(t("withdrawConfirm"))) return;
    setActionLoading(true);
    try {
      await submitOffer(offerId);
      refetch();
    } catch (err) {
      console.error("Submit failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!confirm(t("withdrawConfirm"))) return;
    setActionLoading(true);
    try {
      await withdrawOffer(offerId);
      refetch();
    } catch (err) {
      console.error("Withdraw failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/${locale}/technician/offers`}
        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowRight className="ml-1 h-4 w-4 rtl:rotate-180" />
        {t("myOffers")}
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("offerDetail")}</CardTitle>
          <OfferStatusBadge status={offer.status} />
        </CardHeader>
        <CardContent className="space-y-4">
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
              <p className="font-medium">{offer.duration_days}</p>
            </div>
          )}
          <div className="flex items-center gap-3 pt-4">
            {offer.can_withdraw && (
              <Button onClick={handleWithdraw} disabled={actionLoading} variant="outline">
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                {tActions("withdraw")}
              </Button>
            )}
            {offer.can_edit && (
              <Button variant="outline" onClick={() => router.push(`/${locale}/technician/offers/${offerId}/edit`)}>
                {tActions("edit")}
              </Button>
            )}
            {offer.can_edit && (
              <Button onClick={handleSubmit} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {tActions("submit")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
