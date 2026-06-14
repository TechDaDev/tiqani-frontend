"use client";

import { useTranslations } from "next-intl";
import {
  Search,
  MessageSquare,
  FileText,
  FileSignature,
  Wallet,
  ThumbsUp,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ResponsiveContainer } from "@/components/shared/responsive-container";

const steps = [
  { icon: Search },
  { icon: MessageSquare },
  { icon: FileText },
  { icon: FileSignature },
  { icon: Wallet },
  { icon: ThumbsUp },
];

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <ResponsiveContainer>
        <SectionHeading title={t("title")} description={t("description")} />

        <div className="relative mt-12">
          {/* Connecting line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-primary-soft hidden sm:block sm:left-1/2 sm:-translate-x-px" />

          <div className="space-y-8 sm:space-y-12">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;

              return (
                <div
                  key={i}
                  className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-8"
                >
                  <div
                    className={`flex sm:w-1/2 ${
                      isEven ? "sm:justify-end" : "sm:order-2"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary-soft bg-surface">
                        <span className="text-sm font-bold text-primary">
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {t(`step${i + 1}Title`)}
                        </h3>
                        <p className="mt-1 text-sm text-foreground-muted">
                          {t(`step${i + 1}Desc`)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`hidden sm:flex sm:w-12 shrink-0 items-center justify-center ${
                      isEven ? "sm:order-2" : "sm:order-1"
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <div
                    className={`hidden sm:block sm:w-1/2 ${
                      isEven ? "sm:order-3" : "sm:order-3"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
