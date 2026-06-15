"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthError } from "@/components/auth/auth-error";
import { Link } from "@/lib/i18n/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { ApiClientError } from "@/lib/api/errors";
import type { Locale } from "@/lib/i18n/routing";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const tErr = useTranslations("errors");
  const params = useParams();
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const locale = (params.locale as Locale) || "ar";

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError(t("requiredFields"));
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setIsSent(true);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError(tErr("genericDesc"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <AuthCard
        title={t("checkEmailTitle")}
        description={t("checkEmailDescription")}
        footer={
          <Link href={`/${locale}/reset-password?email=${encodeURIComponent(email)}`} className="font-medium text-primary hover:underline">
            {t("enterResetCode")}
          </Link>
        }
      >
        <div />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={t("forgotPasswordTitle")}
      description={t("forgotPasswordDescription")}
      footer={
        <p>
          {t("rememberPassword")}{" "}
          <Link href={`/${locale}/login`} className="font-medium text-primary hover:underline">
            {t("loginButton")}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthError message={error} />
        <div>
          <label htmlFor="fp-email" className="mb-1.5 block text-sm font-medium text-foreground">
            {t("email")}
          </label>
          <input
            id="fp-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={isSubmitting}
            autoFocus
            className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> {t("sending")}</> : t("sendResetCode")}
        </Button>
      </form>
    </AuthCard>
  );
}
