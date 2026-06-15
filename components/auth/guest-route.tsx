"use client";

import { useEffect, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import type { Locale } from "@/lib/i18n/routing";

type GuestRouteProps = {
  children: ReactNode;
};

export function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as Locale) || "ar";

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(`/${locale}/account`);
    }
  }, [isLoading, isAuthenticated, locale, router]);

  if (isLoading) return null;
  if (isAuthenticated) return null;

  return <>{children}</>;
}
