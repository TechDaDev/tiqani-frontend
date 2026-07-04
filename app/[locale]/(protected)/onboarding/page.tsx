"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Briefcase,
  Star,
  Image,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchTechnicianProfile, fetchIncompleteFields } from "@/lib/api/profiles";
import type {
  TechnicianProfileData,
  IncompleteFieldsData,
} from "@/lib/api/profiles";
import { useAuth } from "@/components/auth/auth-provider";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Locale } from "@/lib/i18n/routing";

type OnboardingStep = {
  key: string;
  icon: typeof UserCheck;
  field: string;
};

const ONBOARDING_STEPS: OnboardingStep[] = [
  { key: "phone", icon: UserCheck, field: "phone_number" },
  { key: "location", icon: UserCheck, field: "governorate" },
  { key: "address", icon: UserCheck, field: "address" },
  { key: "gender", icon: UserCheck, field: "gender" },
  { key: "dob", icon: UserCheck, field: "date_of_birth" },
  { key: "profileImage", icon: Image, field: "profile_image" },
  { key: "jobTitle", icon: Briefcase, field: "job_title" },
  { key: "about", icon: Briefcase, field: "about" },
  { key: "experience", icon: Star, field: "years_of_expertise" },
  { key: "github", icon: Briefcase, field: "github" },
  { key: "linkedin", icon: Briefcase, field: "linkedin" },
  { key: "idDocs", icon: Upload, field: "identification_documents" },
];

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const tProfile = useTranslations("profile");
  const { user } = useAuth();
  const params = useParams();
  const locale = (params.locale as Locale) || "ar";

  const [profile, setProfile] = useState<TechnicianProfileData | null>(null);
  const [incomplete, setIncomplete] = useState<IncompleteFieldsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [profileData, incompleteData] = await Promise.all([
        fetchTechnicianProfile(),
        fetchIncompleteFields(),
      ]);
      setProfile(profileData);
      setIncomplete(incompleteData);
    } catch (err) {
      setError(err instanceof Error ? err.message : tProfile("loadError"));
    } finally {
      setLoading(false);
    }
  }, [tProfile]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-soft border-t-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-foreground-muted">{error}</p>
        <Button onClick={loadData}>{tProfile("tryAgain")}</Button>
      </div>
    );
  }

  const incompleteFieldSet = new Set(incomplete?.incomplete_fields || []);

  const completedSteps = ONBOARDING_STEPS.filter(
    (s) => !incompleteFieldSet.has(s.field)
  ).length;
  const totalSteps = ONBOARDING_STEPS.length;
  const progressPct = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-3xl font-bold">{t("title")}</h1>
      <p className="mb-8 text-foreground-muted">{t("description")}</p>

      {/* Overall progress */}
      {profile && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              {t("progress")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-foreground-muted">
                {completedSteps} / {totalSteps} {t("stepsCompleted")}
              </span>
              <span className="font-medium">{progressPct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval status */}
      {profile && profile.approved !== null && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{t("approvalStatus")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 rounded-lg border border-border p-4">
              {profile.approved ? (
                <>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-300">
                      {t("approved")}
                    </p>
                    <p className="text-sm text-foreground-muted">
                      {t("approvedDesc")}
                    </p>
                  </div>
                </>
              ) : profile.is_complete ? (
                <>
                  <Clock className="h-8 w-8 text-amber-500" />
                  <div>
                    <p className="font-medium text-amber-700 dark:text-amber-300">
                      {t("pending")}
                    </p>
                    <p className="text-sm text-foreground-muted">
                      {t("pendingDesc")}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t("notSubmitted")}</p>
                    <p className="text-sm text-foreground-muted">
                      {t("notSubmittedDesc")}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Steps checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("checklist")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ONBOARDING_STEPS.map((step) => {
              const isDone = !incompleteFieldSet.has(step.field);
              const StepIcon = step.icon;
              return (
                <div
                  key={step.key}
                  className={`flex items-center gap-3 rounded-lg border p-4 ${
                    isDone
                      ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
                      : "border-border"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      isDone
                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                        : "bg-muted text-foreground-muted"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isDone ? "text-green-700 dark:text-green-300 line-through opacity-70" : ""
                      }`}
                    >
                      {t(`steps.${step.key}`)}
                    </p>
                  </div>
                  {!isDone && (
                    <Link
                      href={`/${locale}/profile/technician`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {t("completeNow")}
                      <ArrowRight className="mr-1 inline h-3 w-3" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Profile summary */}
      {profile && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">{t("summary")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-foreground-muted">{tProfile("jobTitle")}</p>
                <p className="text-sm font-medium">
                  {profile.job_title || "—"}
                </p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-foreground-muted">{tProfile("yearsOfExpertise")}</p>
                <p className="text-sm font-medium">
                  {profile.years_of_expertise || 0} {t("years")}
                </p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-foreground-muted">{tProfile("isAvailable")}</p>
                <Badge variant={profile.is_available ? "success" : "outline"}>
                  {profile.is_available ? t("available") : t("unavailable")}
                </Badge>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-foreground-muted">{t("completion")}</p>
                <p className="text-sm font-medium">{progressPct}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
