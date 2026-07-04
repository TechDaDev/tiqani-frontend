"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Loader2,
  Save,
  AlertCircle,
  CheckCircle2,
  Clock,
  CheckCircle,
  ExternalLink,
  FileText,
  ImageIcon,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiClientError } from "@/lib/api/errors";
import {
  fetchTechnicianProfile,
  updateTechnicianProfile,
  fetchIncompleteFields,
  type TechnicianProfileData,
  type IncompleteFieldsData,
} from "@/lib/api/profiles";

export default function TechnicianProfilePage() {
  const t = useTranslations("profile");
  const locale = useLocale();

  const [profile, setProfile] = useState<TechnicianProfileData | null>(null);
  const [incomplete, setIncomplete] = useState<IncompleteFieldsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Editable fields
  const [jobTitle, setJobTitle] = useState("");
  const [about, setAbout] = useState("");
  const [yearsOfExpertise, setYearsOfExpertise] = useState(0);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const [profileData, incompleteData] = await Promise.all([
        fetchTechnicianProfile(),
        fetchIncompleteFields(),
      ]);
      setProfile(profileData);
      setIncomplete(incompleteData);
      setJobTitle(profileData.job_title || "");
      setAbout(profileData.about || "");
      setYearsOfExpertise(profileData.years_of_expertise || 0);
      setGithub(profileData.github || profileData.url1 || "");
      setLinkedin(profileData.linkedin || profileData.url2 || "");
      setIsAvailable(profileData.is_available);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSuccess("");
    const nextFieldErrors: Record<string, string> = {};
    if (!jobTitle.trim()) nextFieldErrors.jobTitle = t("requiredField");
    if (!about.trim()) nextFieldErrors.about = t("requiredField");
    if (!github.trim()) nextFieldErrors.github = t("requiredField");
    if (!linkedin.trim()) nextFieldErrors.linkedin = t("requiredField");
    if (github.trim() && !/^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(github.trim())) {
      nextFieldErrors.github = t("invalidGithub");
    }
    if (linkedin.trim() && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/.test(linkedin.trim())) {
      nextFieldErrors.linkedin = t("invalidLinkedin");
    }
    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors);
      return;
    }
    setSaving(true);
    try {
      const updated = await updateTechnicianProfile({
        job_title: jobTitle || undefined,
        about: about || undefined,
        years_of_expertise: yearsOfExpertise || undefined,
        github: github || undefined,
        linkedin: linkedin || undefined,
        is_available: isAvailable,
      });
      setProfile(updated);
      setSuccess(t("saved"));
      const incompleteData = await fetchIncompleteFields();
      setIncomplete(incompleteData);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError(t("saveError"));
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-soft border-t-primary" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-foreground-muted">{error}</p>
        <Button onClick={loadProfile}>{t("tryAgain")}</Button>
      </div>
    );
  }

  const skillCategories = getNamedItems(profile?.skill_sets, "categories_detail", "categories");
  const skillItems = getNamedItems(profile?.skill_sets, "skills_detail", "skills");
  const subSkillItems = getNamedItems(profile?.skill_sets, "sub_skills_detail", "sub_skills");
  const portfolioImages = getPortfolioImages(profile?.images);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-3xl font-bold">{t("technicianProfile")}</h1>

      {/* Approval status banner */}
      {profile && profile.approved !== null && (
        <div
          className={`mb-6 rounded-lg border p-4 ${
            profile.approved
              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
              : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
          }`}
        >
          <div className="flex items-start gap-3">
            {profile.approved ? (
              <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
            ) : (
              <Clock className="mt-0.5 h-5 w-5 text-amber-600" />
            )}
            <div>
              <p className="font-medium">
                {profile.approved ? t("approved") : t("pendingApproval")}
              </p>
              <p className="mt-1 text-sm">
                {profile.approved
                  ? t("approvedDesc")
                  : t("pendingApprovalDesc")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Completion banner */}
      {incomplete && !incomplete.is_complete && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                {t("incompleteTitle")}
              </p>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                {t("incompleteDesc", {
                  completed: incomplete.completed_count,
                  total: incomplete.total_required,
                })}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {incomplete.incomplete_fields.map((field) => (
                  <Badge key={field} variant="warning">
                    {t(`fields.${field}`, { defaultValue: field })}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.9fr)]">
        {/* Profile form */}
        <Card>
          <CardHeader>
            <CardTitle>{t("professionalInfo")}</CardTitle>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300">
                <CheckCircle2 className="h-4 w-4" />
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="jobTitle"
                  className="mb-1 block text-sm font-medium text-foreground-muted"
                >
                  {t("jobTitle")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="jobTitle"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., HVAC Specialist"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-invalid={Boolean(fieldErrors.jobTitle)}
                />
                {fieldErrors.jobTitle && <p className="mt-1 text-sm text-red-600">{fieldErrors.jobTitle}</p>}
              </div>

              <div>
                <label
                  htmlFor="about"
                  className="mb-1 block text-sm font-medium text-foreground-muted"
                >
                  {t("about")} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={4}
                  placeholder={t("aboutPlaceholder")}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-invalid={Boolean(fieldErrors.about)}
                />
                {fieldErrors.about && <p className="mt-1 text-sm text-red-600">{fieldErrors.about}</p>}
              </div>

              <div>
                <label
                  htmlFor="yearsOfExpertise"
                  className="mb-1 block text-sm font-medium text-foreground-muted"
                >
                  {t("yearsOfExpertise")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="yearsOfExpertise"
                  type="number"
                  min={0}
                  max={50}
                  value={yearsOfExpertise}
                  onChange={(e) => setYearsOfExpertise(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="github"
                  className="mb-1 block text-sm font-medium text-foreground-muted"
                >
                  {t("github")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="github"
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  dir="ltr"
                  required
                  aria-invalid={Boolean(fieldErrors.github)}
                />
                {fieldErrors.github && <p className="mt-1 text-sm text-red-600">{fieldErrors.github}</p>}
              </div>

              <div>
                <label
                  htmlFor="linkedin"
                  className="mb-1 block text-sm font-medium text-foreground-muted"
                >
                  {t("linkedin")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="linkedin"
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  dir="ltr"
                  required
                  aria-invalid={Boolean(fieldErrors.linkedin)}
                />
                {fieldErrors.linkedin && <p className="mt-1 text-sm text-red-600">{fieldErrors.linkedin}</p>}
              </div>

              <label className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-3 py-3">
                <span className="text-sm font-medium text-foreground-muted">{t("isAvailable")}</span>
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(event) => setIsAvailable(event.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
              </label>

              <Button type="submit" disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("saving")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("saveChanges")}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("personalInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-background">
                  {profile?.profile_image ? (
                    <Image
                      src={profile.profile_image}
                      alt={profile.full_name || profile.username}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized={profile.profile_image.startsWith("http")}
                    />
                  ) : (
                    <ImageIcon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-foreground-muted" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold">{profile?.full_name || t("notProvided")}</p>
                  <p className="truncate text-sm text-foreground-muted">{profile?.username || t("notProvided")}</p>
                </div>
              </div>
              <InfoRow label={t("email")} value={profile?.email} />
              <InfoRow label={t("phoneNumber")} value={profile?.phone_number} />
              <InfoRow label={t("governorate")} value={profile?.governorate} />
              <InfoRow label={t("address")} value={profile?.address} />
              <InfoRow label={t("fields.gender")} value={formatGender(profile?.gender, t)} />
              <InfoRow label={t("fields.date_of_birth")} value={formatDate(profile?.date_of_birth, locale)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("accountStatus")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label={t("isAvailable")} value={profile?.is_available ? t("available") : t("notAvailable")} />
              <InfoRow label={t("rating")} value={profile?.rate ?? null} />
              <InfoRow label={t("lastActive")} value={formatDate(profile?.last_active, locale)} />
              <InfoRow label={t("completion")} value={incomplete ? `${incomplete.completion_percentage}%` : null} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                {t("wallet")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label={t("walletId")} value={profile?.wallet_id} dir="ltr" />
              <InfoRow label={t("balance")} value={profile?.balance ? `${profile.balance} IQD` : null} dir="ltr" />
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("documentsAndSkills")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <LinkRow
                label={t("fields.identification_documents")}
                href={profile?.identification_documents}
                fallback={t("notProvided")}
              />
              <LinkRow label={t("github")} href={profile?.github || profile?.url1} fallback={t("notProvided")} />
              <LinkRow label={t("linkedin")} href={profile?.linkedin || profile?.url2} fallback={t("notProvided")} />
            </div>
            <div className="space-y-4">
              <ChipGroup label={t("categories")} items={skillCategories} emptyLabel={t("notProvided")} />
              <ChipGroup label={t("skills")} items={skillItems} emptyLabel={t("notProvided")} />
              <ChipGroup label={t("subSkills")} items={subSkillItems} emptyLabel={t("notProvided")} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("portfolioImages")}</CardTitle>
          </CardHeader>
          <CardContent>
            {portfolioImages.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {portfolioImages.map((image) => (
                  <a
                    key={image.id || image.image}
                    href={image.image}
                    target="_blank"
                    rel="noreferrer"
                    className="group block overflow-hidden rounded-lg border border-border bg-background"
                  >
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src={image.image}
                        alt={image.description || t("portfolioImage")}
                        fill
                        sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        unoptimized={image.image.startsWith("http")}
                      />
                    </div>
                    <div className="space-y-1 p-3">
                      <p className="line-clamp-2 text-sm">{image.description || t("portfolioImage")}</p>
                      <p className="text-xs text-foreground-muted">{formatDate(image.uploaded_at, locale)}</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground-muted">{t("notProvided")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  dir,
}: {
  label: string;
  value: string | number | null | undefined;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="grid gap-1 text-sm">
      <span className="text-foreground-muted">{label}</span>
      <span className="break-words font-medium" dir={dir}>
        {value || "-"}
      </span>
    </div>
  );
}

function LinkRow({
  label,
  href,
  fallback,
}: {
  label: string;
  href: string | null | undefined;
  fallback: string;
}) {
  return (
    <div className="grid gap-1 text-sm">
      <span className="text-foreground-muted">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-w-0 items-center gap-2 font-medium text-primary hover:underline"
          dir="ltr"
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span className="truncate">{getFileName(href)}</span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      ) : (
        <span className="font-medium">{fallback}</span>
      )}
    </div>
  );
}

function ChipGroup({
  label,
  items,
  emptyLabel,
}: {
  label: string;
  items: string[];
  emptyLabel: string;
}) {
  return (
    <div className="grid gap-2 text-sm">
      <span className="text-foreground-muted">{label}</span>
      {items.length ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Badge key={item}>
              {item}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="font-medium">{emptyLabel}</span>
      )}
    </div>
  );
}

function formatDate(value: string | null | undefined, locale: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

function formatGender(value: string | null | undefined, t: ReturnType<typeof useTranslations<"profile">>) {
  if (value === "male" || value === "female") return t(`genders.${value}`);
  return value || null;
}

function getNamedItems(
  source: Record<string, unknown> | null | undefined,
  detailKey: string,
  fallbackKey: string
) {
  if (!source) return [];
  const detail = source[detailKey];
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "name" in item) {
          return String((item as { name?: unknown }).name || "");
        }
        return "";
      })
      .filter(Boolean);
  }
  const fallback = source[fallbackKey];
  if (Array.isArray(fallback)) return fallback.map(String).filter(Boolean);
  return [];
}

function getPortfolioImages(images: Array<Record<string, unknown>> | undefined) {
  if (!Array.isArray(images)) return [];
  return images
    .map((image) => ({
      id: typeof image.id === "string" ? image.id : "",
      image: typeof image.image === "string" ? image.image : "",
      description: typeof image.description === "string" ? image.description : "",
      uploaded_at: typeof image.uploaded_at === "string" ? image.uploaded_at : "",
    }))
    .filter((image) => image.image);
}

function getFileName(value: string) {
  try {
    const url = new URL(value);
    return decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() || value);
  } catch {
    return value.split("/").filter(Boolean).pop() || value;
  }
}
