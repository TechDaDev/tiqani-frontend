"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthError } from "@/components/auth/auth-error";
import { PasswordField } from "@/components/auth/password-field";
import { Link } from "@/lib/i18n/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { ApiClientError } from "@/lib/api/errors";
import type { Locale } from "@/lib/i18n/routing";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const tErr = useTranslations("errors");
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const locale = (params.locale as Locale) || "ar";

  const email = searchParams.get("email") || "";
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!otpCode.trim() || !newPassword) {
      setError(t("requiredFields"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setFieldErrors({ new_password: t("passwordMismatch") });
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email, otpCode.trim(), newPassword);
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
        if (err.fieldErrors) {
          const mapped: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(err.fieldErrors)) {
            mapped[key] = msgs.join(", ");
          }
          setFieldErrors(mapped);
        }
      } else {
        setError(tErr("genericDesc"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthCard
        title={t("resetSuccessTitle")}
        description={t("resetSuccessDescription")}
        footer={
          <Link href={`/${locale}/login`} className="font-medium text-primary hover:underline">
            {t("loginButton")}
          </Link>
        }
      >
        <div />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={t("resetPasswordTitle")}
      description={t("resetPasswordDescription")}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthError message={error} />

        <div>
          <label htmlFor="rp-otp" className="mb-1.5 block text-sm font-medium text-foreground">
            {t("otpCode")}
          </label>
          <input
            id="rp-otp"
            type="text"
            inputMode="numeric"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            autoComplete="one-time-code"
            disabled={isSubmitting}
            maxLength={6}
            className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>

        <PasswordField id="rp-new-password" label={t("newPassword")} value={newPassword} onChange={setNewPassword} error={fieldErrors.new_password} autoComplete="new-password" disabled={isSubmitting} />
        <PasswordField id="rp-confirm-password" label={t("confirmPassword")} value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" disabled={isSubmitting} />

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> {t("resetting")}</> : t("resetButton")}
        </Button>
      </form>
    </AuthCard>
  );
}
