"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTechnicianRequestDetail } from "@/lib/requests/query";
import { useState } from "react";
import { createOffer } from "@/lib/offers/query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n/routing";
import { useRouter } from "next/navigation";

export default function CreateOfferPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as Locale) || "ar";
  const requestId = params.requestId as string;
  const t = useTranslations("offerForm");
  const tOffers = useTranslations("offers");
  const tCommon = useTranslations("common");

  const { data: request, isLoading: reqLoading } = useTechnicianRequestDetail(requestId);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (reqLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!request || request.status !== "ACCEPTED") {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <p className="text-red-500">{tOffers("offerErrors.notFound")}</p>
        <Link href={`/${locale}/technician/requests`} className="mt-4 inline-flex items-center text-sm text-primary hover:underline">
          <ArrowRight className="ml-1 h-4 w-4" />
          {tCommon("back")}
        </Link>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!amount || parseFloat(amount) <= 0) errs.amount = t("validation.amountPositive");
    if (!description.trim()) errs.description = t("validation.descriptionRequired");
    if (durationDays && (parseInt(durationDays) <= 0 || isNaN(parseInt(durationDays)))) {
      errs.durationDays = t("validation.durationPositive");
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const offer = await createOffer({
        service_request_id: requestId,
        amount,
        description,
        duration_days: durationDays ? parseInt(durationDays) : null,
      });
      router.push(`/${locale}/technician/offers/${offer.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : tOffers("offerErrors.createFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{request.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{request.client?.full_name}</p>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-foreground-muted dark:text-gray-300">{request.description}</p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">{t("amountLabel")}</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            placeholder={t("amountPlaceholder")}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-invalid={!!errors.amount}
          />
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">{t("descriptionLabel")}</label>
          <textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder={t("descriptionPlaceholder")}
            rows={5}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-invalid={!!errors.description}
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">{t("durationLabel")}</label>
          <input
            type="number"
            min="1"
            value={durationDays}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDurationDays(e.target.value)}
            placeholder={t("durationPlaceholder")}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.durationDays && <p className="mt-1 text-xs text-red-500">{errors.durationDays}</p>}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t("submit")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {t("cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}
