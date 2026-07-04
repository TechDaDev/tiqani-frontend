"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-provider";
import { isAdmin } from "@/lib/auth/roles";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations("admin.navigation");
  const params = useParams<{ locale: string }>();
  const canUseAdmin = Boolean(user && (user.isStaff || isAdmin(user.role)));

  useEffect(() => {
    if (user && !canUseAdmin) {
      router.replace(`/${params.locale || "ar"}/account`);
    }
  }, [canUseAdmin, params.locale, router, user]);

  if (!canUseAdmin) return null;
  const locale = params.locale || "en";
  const nav = [
    ["dashboard", `/${locale}/admin/dashboard`],
    ["users", `/${locale}/admin/users`],
    ["technicians", `/${locale}/admin/technicians`],
    ["financial", `/${locale}/admin/financial`],
    ["audit", `/${locale}/admin/audit`],
    ["system", `/${locale}/admin/system`],
  ] as const;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <nav className="flex flex-wrap gap-2 border-b pb-3" aria-label="Admin">
        {nav.map(([key, href]) => (
          <Link key={key} href={href} className="rounded px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
            {t(key)}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
