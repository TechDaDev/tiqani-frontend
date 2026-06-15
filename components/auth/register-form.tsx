"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthError } from "@/components/auth/auth-error";
import { PasswordField } from "@/components/auth/password-field";
import { Link } from "@/lib/i18n/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { ApiClientError } from "@/lib/api/errors";
import type { Locale } from "@/lib/i18n/routing";

export function RegisterForm() {
  const t = useTranslations("auth");
  const tNav = useTranslations("navigation");
  const tErr = useTranslations("errors");
  const params = useParams();
  const router = useRouter();
  const { register } = useAuth();
  const locale = (params.locale as Locale) || "ar";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState<"client" | "technician">("client");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password) {
      setError(t("requiredFields"));
      return;
    }
    if (password !== passwordConfirm) {
      setFieldErrors({ password_confirm: t("passwordMismatch") });
      return;
    }
    if (role === "technician" && !jobTitle.trim()) {
      setFieldErrors({ job_title: t("jobTitleRequired") });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({
        username: username.trim(),
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        role,
        phone_number: phoneNumber.trim() || undefined,
        job_title: role === "technician" ? jobTitle.trim() : undefined,
      });
      // Store email in sessionStorage for OTP verification
      try { sessionStorage.setItem("tiqani_verify_email", email.trim()); } catch {}
      router.push(`/${locale}/verify-otp?email=${encodeURIComponent(email.trim())}`);
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
      title={t("registerTitle")}
      description={t("registerDescription")}
      footer={
        <p>
          {t("hasAccount")}{" "}
          <Link href={`/${locale}/login`} className="font-medium text-primary hover:underline">
            {t("loginButton")}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthError message={error} />

        {/* Role toggle */}
        <div className="flex gap-2 rounded-lg border border-border p-1">
          <button
            type="button"
            onClick={() => setRole("client")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              role === "client" ? "bg-primary text-white" : "text-foreground-muted hover:text-foreground"
            }`}
          >
            {t("roleClient")}
          </button>
          <button
            type="button"
            onClick={() => setRole("technician")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              role === "technician" ? "bg-primary text-white" : "text-foreground-muted hover:text-foreground"
            }`}
          >
            {t("roleTechnician")}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-foreground">{t("firstName")}</label>
            <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" disabled={isSubmitting} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-foreground">{t("lastName")}</label>
            <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" disabled={isSubmitting} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" />
          </div>
        </div>

        <div>
          <label htmlFor="reg-username" className="mb-1.5 block text-sm font-medium text-foreground">{t("username")}</label>
          <input id="reg-username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" disabled={isSubmitting} aria-invalid={!!fieldErrors.username} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" />
          {fieldErrors.username && <p className="mt-1 text-xs text-danger" role="alert">{fieldErrors.username}</p>}
        </div>

        <div>
          <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-foreground">{t("email")}</label>
          <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" disabled={isSubmitting} aria-invalid={!!fieldErrors.email} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" />
          {fieldErrors.email && <p className="mt-1 text-xs text-danger" role="alert">{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="reg-phone" className="mb-1.5 block text-sm font-medium text-foreground">{t("phoneNumber")}</label>
          <input id="reg-phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} autoComplete="tel" disabled={isSubmitting} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" />
        </div>

        {role === "technician" && (
          <div>
            <label htmlFor="jobTitle" className="mb-1.5 block text-sm font-medium text-foreground">{t("jobTitle")}</label>
            <input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} disabled={isSubmitting} aria-invalid={!!fieldErrors.job_title} className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" />
            {fieldErrors.job_title && <p className="mt-1 text-xs text-danger" role="alert">{fieldErrors.job_title}</p>}
          </div>
        )}

        <PasswordField id="reg-password" label={t("password")} value={password} onChange={setPassword} error={fieldErrors.password} autoComplete="new-password" disabled={isSubmitting} />
        <PasswordField id="reg-password-confirm" label={t("confirmPassword")} value={passwordConfirm} onChange={setPasswordConfirm} error={fieldErrors.password_confirm} autoComplete="new-password" disabled={isSubmitting} />

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> {t("registering")}</> : t("registerButton")}
        </Button>
      </form>
    </AuthCard>
  );
}
