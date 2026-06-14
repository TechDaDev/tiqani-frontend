"use client";

import { useTranslations } from "next-intl";
import {
  Network,
  Code,
  Shield,
  Monitor,
  Camera,
  Headphones,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Card } from "@/components/ui/card";

const categories = [
  { key: "networking", icon: Network },
  { key: "software", icon: Code },
  { key: "cybersecurity", icon: Shield },
  { key: "maintenance", icon: Monitor },
  { key: "surveillance", icon: Camera },
  { key: "consulting", icon: Headphones },
];

export function CategorySection() {
  const t = useTranslations("categories");

  return (
    <section id="services" className="bg-surface-subtle py-16 sm:py-24">
      <ResponsiveContainer>
        <SectionHeading title={t("title")} description={t("description")} />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Card
                key={cat.key}
                className="p-6 transition-all hover:shadow-md hover:border-primary/30 cursor-pointer"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-soft">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  {t(`${cat.key}`)}
                </h3>
                <p className="text-sm text-foreground-muted">
                  {t(`${cat.key}Desc`)}
                </p>
              </Card>
            );
          })}
        </div>
      </ResponsiveContainer>
    </section>
  );
}
