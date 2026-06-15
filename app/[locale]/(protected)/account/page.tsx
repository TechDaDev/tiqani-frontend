"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { LogOut, User, Shield, BadgeCheck, AlertTriangle } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import type { Locale } from "@/lib/i18n/routing";

export default function AccountPage() {
  const t = useTranslations("account");
  const tCommon = useTranslations("common");
  const { user, logout } = useAuth();
  const params = useParams();
  const locale = (params.locale as Locale) || "ar";

  if (!user) return null;

  return (
    <>
      <PublicHeader />
      <main id="main-content" className="min-h-screen pt-24 pb-12">
        <ResponsiveContainer>
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-2xl font-bold text-primary">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle>{user.fullName}</CardTitle>
                    <p className="text-sm text-foreground-muted">@{user.username}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 text-sm text-foreground-muted mb-1">
                      <Shield className="h-4 w-4" />
                      {t("role")}
                    </div>
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center gap-2 text-sm text-foreground-muted mb-1">
                      <BadgeCheck className="h-4 w-4" />
                      {t("status")}
                    </div>
                    <Badge variant={user.isVerified ? "success" : "warning"}>
                      {user.isVerified ? t("verified") : t("unverified")}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm text-foreground-muted mb-1">{t("userId")}</p>
                  <p className="font-mono text-sm">{user.id}</p>
                </div>

                <Button variant="danger" onClick={logout} className="w-full">
                  <LogOut className="h-4 w-4" />
                  {tCommon("logout")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </ResponsiveContainer>
      </main>
      <PublicFooter />
    </>
  );
}
