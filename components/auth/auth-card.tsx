"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/lib/i18n/navigation";
import { Logo } from "@/components/shared/logo";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/routing";

type AuthCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function AuthCard({ title, description, children, footer, className }: AuthCardProps) {
  const params = useParams();
  const locale = (params.locale as Locale) || "ar";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <ResponsiveContainer className="flex justify-center">
        <div className={cn("w-full max-w-md", className)}>
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <Logo locale={locale} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-foreground-muted">{description}</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            {children}
          </div>

          {footer && (
            <div className="mt-6 text-center text-sm text-foreground-muted">
              {footer}
            </div>
          )}
        </div>
      </ResponsiveContainer>
    </div>
  );
}
