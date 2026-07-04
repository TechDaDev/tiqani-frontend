"use client";

import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { useTechnicianOffers } from "@/lib/offers/query";
import { OfferCard } from "@/components/offers/offer-card";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/routing";

export default function TechnicianOfferListPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as Locale) || "ar";
  const t = useTranslations("offers");
  const tOfferErrors = useTranslations("offerErrors");
  const tCommon = useTranslations("common");

  const { data: offers, isLoading, error, refetch } = useTechnicianOffers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">{tOfferErrors("loadFailed")}</p>
        <Button onClick={refetch} variant="outline" className="mt-4">
          {tCommon("tryAgain")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("myOffers")}</h1>
      </div>

      {!offers || offers.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          <p>{t("noOffers")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              href={`/${locale}/technician/offers/${offer.id}`}
              role="technician"
            />
          ))}
        </div>
      )}
    </div>
  );
}
