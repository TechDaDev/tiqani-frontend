"use client";

import { useTranslations } from "next-intl";
import {
  UserCheck,
  Lock,
  FileText,
  FileSignature,
  Layers,
  ShieldCheck,
  Archive,
  Star,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ResponsiveContainer } from "@/components/shared/responsive-container";

const features = [
  { key: "verifiedProfessionals", icon: UserCheck },
  { key: "secureCommunication", icon: Lock },
  { key: "transparentOffers", icon: FileText },
  { key: "electronicContracts", icon: FileSignature },
  { key: "stageBasedDelivery", icon: Layers },
  { key: "protectedPayments", icon: ShieldCheck },
  { key: "preservedEvidence", icon: Archive },
  { key: "ratingsAccountability", icon: Star },
];

export function WhyTiqani() {
  const t = useTranslations("whyTiqani");

  return (
    <section id="why-tiqani" className="py-16 sm:py-24">
      <ResponsiveContainer>
        <SectionHeading title={t("title")} description={t("description")} />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.key}
                className="group rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-5 w-5 text-primary transition-colors group-hover:text-white" />
                </div>
                <h3 className="mb-2 font-semibold">
                  {t(`${feature.key}`)}
                </h3>
                <p className="text-sm text-foreground-muted">
                  {t(`${feature.key}Desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </ResponsiveContainer>
    </section>
  );
}
