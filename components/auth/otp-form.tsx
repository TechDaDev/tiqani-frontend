"use client";

import { useState, useRef, useEffect, type FormEvent, type ClipboardEvent } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthError } from "@/components/auth/auth-error";
import { useAuth } from "@/components/auth/auth-provider";
import { ApiClientError } from "@/lib/api/errors";
import type { Locale } from "@/lib/i18n/routing";

const OTP_LENGTH = 6;

export function OtpForm() {
  const t = useTranslations("auth");
  const tErr = useTranslations("errors");
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp } = useAuth();
  const locale = (params.locale as Locale) || "ar";

  const email = searchParams.get("email") || "";
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    inputsRef.current[0]?.focus();
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, []);

  const startCooldown = (seconds: number) => {
    setResendCooldown(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError("");

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newDigits = [...digits];
    for (let i = 0; i < text.length; i++) {
      newDigits[i] = text[i];
    }
    setDigits(newDigits);
    const focusIndex = Math.min(text.length, OTP_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length !== OTP_LENGTH || !email) return;

    setIsSubmitting(true);
    setError("");
    try {
      await verifyOtp(email, otp);
      router.push(`/${locale}/login`);
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

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;
    try {
      const result = await resendOtp(email);
      setResendCount((c) => c + 1);
      startCooldown(300); // 5 minutes
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      }
    }
  };

  const otpValue = digits.join("");

  return (
    <AuthCard
      title={t("verifyOtpTitle")}
      description={email ? t("verifyOtpDescription", { email }) : undefined}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <AuthError message={error} />

        <div className="flex justify-center gap-2" role="group" aria-label={t("otpInputLabel")}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              autoComplete="one-time-code"
              disabled={isSubmitting}
              aria-label={`${t("otpDigitLabel")} ${i + 1}`}
              className="h-12 w-12 rounded-lg border border-border bg-input text-center text-lg font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          ))}
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting || otpValue.length !== OTP_LENGTH}>
          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> {t("verifying")}</> : t("verifyButton")}
        </Button>

        <div className="text-center">
          {resendCooldown > 0 ? (
            <p className="text-sm text-foreground-muted">
              {t("resendCooldown", { seconds: resendCooldown })}
            </p>
          ) : (
            <button type="button" onClick={handleResend} className="text-sm font-medium text-primary hover:underline" disabled={isSubmitting}>
              {t("resendButton")}
            </button>
          )}
        </div>
      </form>
    </AuthCard>
  );
}
