"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  MessageSquare,
  FileCheck,
  FileSignature,
  Wallet,
  Package,
  ThumbsUp,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { cn } from "@/lib/utils";
import { type Locale } from "@/lib/i18n/routing";

const flowSteps = [
  { key: "discuss", icon: MessageSquare },
  { key: "agree", icon: FileCheck },
  { key: "sign", icon: FileSignature },
  { key: "fund", icon: Wallet },
  { key: "deliver", icon: Package },
  { key: "approve", icon: ThumbsUp },
];

export function ContractProtection() {
  const t = useTranslations("contractProtection");
  const params = useParams();
  const locale = (params.locale as Locale) || "en";
  const isRtl = locale === "ar" || locale === "ku";

  return (
    <section className="bg-surface-subtle py-16 sm:py-24">
      <ResponsiveContainer>
        <SectionHeading title={t("title")} description={t("description")} />

        {/* Flow steps */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {flowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.key} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary-soft bg-surface">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground-muted">
                    {t(step.key)}
                  </span>
                </div>
                {i < flowSteps.length - 1 && (
                  <div
                    className={cn(
                      "hidden sm:block w-8 h-0.5 bg-primary-soft mt-[-1.5rem]",
                      isRtl && "scale-x-[-1]"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Description cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {flowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.key}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{t(step.key)}</h3>
                </div>
                <p className="text-sm text-foreground-muted">
                  {t(`${step.key}Desc`)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border border-primary-soft bg-primary-soft/30 p-4 text-center text-sm text-foreground-muted">
          {t("note")}
        </div>
      </ResponsiveContainer>
    </section>
  );
}
