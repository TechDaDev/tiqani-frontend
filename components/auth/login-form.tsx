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
import { isSafeNextPath } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n/routing";

export function LoginForm() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("navigation");
  const tErr = useTranslations("errors");
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const locale = (params.locale as Locale) || "ar";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const next = searchParams.get("next");
  const safeNext = next && isSafeNextPath(next) ? next : `/${locale}/account`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!username.trim() || !password) {
      setError(t("requiredFields"));
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username, password);
      router.push(safeNext);
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

  return (
    <AuthCard
      title={t("loginTitle")}
      description={t("loginDescription")}
      footer={
        <>
          <p className="mb-2">
            {t("noAccount")}{" "}
            <Link href={`/${locale}/register`} className="font-medium text-primary hover:underline">
              {tNav("createAccount")}
            </Link>
          </p>
          <Link href={`/${locale}/forgot-password`} className="text-sm text-primary hover:underline">
            {t("forgotPassword")}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthError message={error} className="mb-4" />

        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-foreground">
            {t("usernameOrEmail")}
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            disabled={isSubmitting}
            autoFocus
            aria-invalid={!!fieldErrors.username}
            aria-describedby={fieldErrors.username ? "username-error" : undefined}
            className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          {fieldErrors.username && (
            <p id="username-error" className="mt-1 text-xs text-danger" role="alert">{fieldErrors.username}</p>
          )}
        </div>

        <PasswordField
          id="password"
          label={tCommon("password")}
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          autoComplete="current-password"
          disabled={isSubmitting}
        />

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> {tCommon("loading")}</>
          ) : (
            t("loginButton")
          )}
        </Button>
      </form>
    </AuthCard>
  );
}
