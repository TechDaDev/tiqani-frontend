"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Loader2 } from "lucide-react";
import { useCreateRequest } from "@/lib/requests/query";
import type { CreateServiceRequestPayload } from "@/lib/requests/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n/routing";
import Link from "next/link";

interface FormErrors {
  [key: string]: string;
}

function validateForm(data: Record<string, string | boolean>): FormErrors {
  const errors: FormErrors = {};
  if (!data.title || String(data.title).length < 5) {
    errors.title = "Title must be at least 5 characters";
  }
  if (!data.description || String(data.description).length < 20) {
    errors.description = "Description must be at least 20 characters";
  }
  return errors;
}

export default function NewRequestPage() {
  const t = useTranslations("requestForm");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params.locale as Locale) || "ar";
  const technicianId = searchParams.get("technician") || "";
  const technicianName = searchParams.get("name") || "";

  const { mutate: createRequest, isPending, error: submitError } = useCreateRequest();
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    technician: technicianId,
    title: "",
    description: "",
    governorate: "",
    service_address: "",
    preferred_date: "",
    preferred_time: "",
    is_urgent: false,
  });

  useEffect(() => {
    if (technicianId) {
      setFormData((prev) => ({ ...prev, technician: technicianId }));
    }
  }, [technicianId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    // Clear field error on change
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(formData as unknown as Record<string, string | boolean>);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstError = document.querySelector("[data-error]");
      if (firstError) (firstError as HTMLElement).focus();
      return;
    }
    try {
      const result = await createRequest(formData as unknown as CreateServiceRequestPayload);
      router.push(`/${locale}/client/requests/${result.id}`);
    } catch {}
  };

  const inputClass =
    "w-full rounded-lg border border-border-warm bg-surface-pure px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100";
  const labelClass = "block text-sm font-medium text-foreground-muted dark:text-gray-300 mb-1";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={technicianId ? `/${locale}/marketplace/technicians/${technicianId}` : `/${locale}/client/requests`}
        className="mb-4 inline-flex items-center text-sm text-primary hover:underline"
      >
        <ArrowRight className="ml-1 h-4 w-4" />
        {tCommon("back")}
      </Link>

      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

      {technicianName && (
        <Card className="mb-6 bg-primary-soft/50">
          <CardContent className="p-4">
            <p className="text-sm text-foreground-muted dark:text-gray-400">{t("requestingTo")}</p>
            <p className="font-semibold">{decodeURIComponent(technicianName)}</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="title" className={labelClass}>
            {t("title")}
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder={t("titlePlaceholder")}
            className={inputClass}
            aria-invalid={!!formErrors.title}
            data-error={!!formErrors.title}
          />
          {formErrors.title && <p className={errorClass} role="alert">{formErrors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            {t("description")}
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder={t("descriptionPlaceholder")}
            className={inputClass}
            aria-invalid={!!formErrors.description}
            data-error={!!formErrors.description}
          />
          <p className="mt-1 text-xs text-neutral-soft">{t("descriptionHint")}</p>
          {formErrors.description && <p className={errorClass} role="alert">{formErrors.description}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="governorate" className={labelClass}>
              {t("governorate")}
            </label>
            <input
              id="governorate"
              name="governorate"
              type="text"
              value={formData.governorate}
              onChange={handleChange}
              placeholder={t("governoratePlaceholder")}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="service_address" className={labelClass}>
              {t("serviceAddress")}
            </label>
            <input
              id="service_address"
              name="service_address"
              type="text"
              value={formData.service_address}
              onChange={handleChange}
              placeholder={t("addressPlaceholder")}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="preferred_date" className={labelClass}>
              {t("preferredDate")}
            </label>
            <input
              id="preferred_date"
              name="preferred_date"
              type="date"
              value={formData.preferred_date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="preferred_time" className={labelClass}>
              {t("preferredTime")}
            </label>
            <input
              id="preferred_time"
              name="preferred_time"
              type="time"
              value={formData.preferred_time}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="is_urgent"
            name="is_urgent"
            type="checkbox"
            checked={formData.is_urgent}
            onChange={handleChange}
            className="h-4 w-4 rounded border-border-warm"
          />
          <label htmlFor="is_urgent" className="text-sm font-medium text-foreground-muted dark:text-gray-300">
            {t("isUrgent")}
          </label>
        </div>

        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {submitError instanceof Error ? submitError.message : t("errors.submitFailed")}
          </div>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </Button>
      </form>
    </div>
  );
}
