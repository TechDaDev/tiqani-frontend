"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import { LogOut, User, Shield, BadgeCheck, AlertTriangle, Mail, Phone } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/lib/i18n/routing";
import { isClient, isTechnician } from "@/lib/auth/guards";
import Link from "next/link";

export default function AccountPage() {
  const t = useTranslations("account");
  const tCommon = useTranslations("common");
  const { user, logout } = useAuth();
  const params = useParams();
  const locale = (params.locale as Locale) || "ar";

  if (!user) return null;

  const userRole = user.role as string;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>

      {/* User identity card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-3xl font-bold text-primary">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.fullName}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized={user.profileImage.startsWith("http") && !user.profileImage.includes("localhost")}
                />
              ) : (
                user.fullName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <CardTitle className="text-xl">{user.fullName || user.username}</CardTitle>
              <p className="text-sm text-foreground-muted">@{user.username}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                <Badge variant="outline" className="capitalize">
                  {userRole}
                </Badge>
                {user.isVerified ? (
                  <Badge variant="success">
                    <BadgeCheck className="mr-1 h-3 w-3" />
                    {t("verified")}
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {t("unverified")}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick contact info */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {user.email && (
          <div className="flex items-center gap-3 rounded-lg border border-border p-4">
            <Mail className="h-5 w-5 text-foreground-muted" />
            <div>
              <p className="text-xs text-foreground-muted">{t("email")}</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
          </div>
        )}
        {user.phoneNumber && (
          <div className="flex items-center gap-3 rounded-lg border border-border p-4">
            <Phone className="h-5 w-5 text-foreground-muted" />
            <div>
              <p className="text-xs text-foreground-muted">{t("phone")}</p>
              <p className="text-sm font-medium font-mono" dir="ltr">
                {user.phoneNumber}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Role-specific quick links */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{t("quickLinks")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isClient(user.role) && (
            <Link
              href={`/${locale}/profile/client`}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted"
            >
              <span className="font-medium">{t("clientProfile")}</span>
              <span className="text-sm text-primary">{t("view")}</span>
            </Link>
          )}
          {isTechnician(user.role) && (
            <>
              <Link
                href={`/${locale}/profile/technician`}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted"
              >
                <span className="font-medium">{t("technicianProfile")}</span>
                <span className="text-sm text-primary">{t("view")}</span>
              </Link>
              <Link
                href={`/${locale}/onboarding`}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted"
              >
                <span className="font-medium">{t("onboarding")}</span>
                <span className="text-sm text-primary">{t("view")}</span>
              </Link>
            </>
          )}
        </CardContent>
      </Card>

      {/* User ID */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{t("accountInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-foreground-muted mb-1">{t("userId")}</p>
            <p className="font-mono text-xs">{user.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
