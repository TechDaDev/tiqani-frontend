"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Shield, MessageSquare, FileText, Wallet, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { type Locale } from "@/lib/i18n/routing";

const workflowSteps = [
  { key: "step1", icon: Search },
  { key: "step2", icon: MessageSquare },
  { key: "step3", icon: FileText },
  { key: "step4", icon: FileText },
  { key: "step5", icon: Wallet },
  { key: "step6", icon: CheckCircle },
];

export function HeroSection() {
  const t = useTranslations("hero");
  const params = useParams();
  const locale = (params.locale as Locale) || "en";
  const isRtl = locale === "ar" || locale === "ku";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-surface-subtle to-background pb-16 pt-24 sm:pt-32">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,139,141,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,139,141,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]" />

      <ResponsiveContainer>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-soft bg-primary-soft/50 px-4 py-1.5 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            {t("badge")}
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground-muted sm:text-xl">
            {t("description")}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/marketplace">
              <Button variant="primary" size="lg">
                {t("primaryAction")}
                <Arrow className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register?role=technician">
              <Button variant="outline" size="lg">
                {t("secondaryAction")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Workflow visualization */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="flex items-center justify-between gap-0 overflow-x-auto px-4 pb-4">
            {workflowSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center gap-2 min-w-[80px]"
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors",
                      "border-primary-soft bg-surface text-primary"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-foreground-muted text-center whitespace-nowrap">
                    {t(step.key)}
                  </span>
                  {i < workflowSteps.length - 1 && (
                    <div className="hidden sm:block absolute top-6 h-[2px] bg-primary-soft" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Connecting line */}
          <div className="relative mt-2 hidden sm:block">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-primary-soft">
              <div className="h-full w-0 animate-pulse bg-primary" />
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
