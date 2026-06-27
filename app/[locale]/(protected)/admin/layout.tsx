"use client";

import { useEffect, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { isAdmin } from "@/lib/auth/roles";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const canUseAdmin = Boolean(user && (user.isStaff || isAdmin(user.role)));

  useEffect(() => {
    if (user && !canUseAdmin) {
      router.replace(`/${params.locale || "ar"}/account`);
    }
  }, [canUseAdmin, params.locale, router, user]);

  if (!canUseAdmin) return null;
  return <>{children}</>;
}
