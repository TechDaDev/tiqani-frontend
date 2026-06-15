"use client";

import { useEffect, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import type { Locale } from "@/lib/i18n/routing";

type ProtectedRouteProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as Locale) || "ar";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}/login?next=/${locale}/account`);
    }
  }, [isLoading, isAuthenticated, locale, router]);

  if (isLoading) {
    return fallback ? <>{fallback}</> : <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center" role="status">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-soft border-t-primary" />
      </div>
    </div>
  );
}
