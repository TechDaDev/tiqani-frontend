"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Briefcase, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { LocaleLink } from "@/components/shared/locale-link";
import { type Locale } from "@/lib/i18n/routing";

export function AudienceCta() {
  const t = useTranslations("cta");
  const params = useParams();
  const locale = (params.locale as Locale) || "en";
  const isRtl = locale === "ar" || locale === "ku";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="bg-surface-subtle py-16 sm:py-24">
      <ResponsiveContainer>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Client CTA */}
          <div className="rounded-xl border border-border bg-surface p-8 sm:p-10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-soft">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">{t("clientTitle")}</h2>
            <p className="mt-3 text-foreground-muted">{t("clientDesc")}</p>
            <div className="mt-6">
              <LocaleLink href="/marketplace">
                <Button variant="primary" size="lg">
                  {t("clientAction")}
                  <Arrow className="h-5 w-5" />
                </Button>
              </LocaleLink>
            </div>
          </div>

          {/* Technician CTA */}
          <div className="rounded-xl border border-border bg-surface p-8 sm:p-10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-soft">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">{t("technicianTitle")}</h2>
            <p className="mt-3 text-foreground-muted">{t("technicianDesc")}</p>
            <div className="mt-6">
              <LocaleLink href="/register?role=technician">
                <Button variant="outline" size="lg">
                  {t("technicianAction")}
                  <Arrow className="h-5 w-5" />
                </Button>
              </LocaleLink>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
