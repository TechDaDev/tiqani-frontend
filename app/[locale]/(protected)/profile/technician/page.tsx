"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import {
  Loader2,
  Save,
  AlertCircle,
  CheckCircle2,
  Clock,
  Ban,
  CheckCircle,
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
      setGithub(profileData.skill_sets?.github_url as string || "");
      setLinkedin(profileData.skill_sets?.linkedin_url as string || "");
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
    setSuccess("");
    setSaving(true);
    try {
      const updated = await updateTechnicianProfile({
        job_title: jobTitle || undefined,
        about: about || undefined,
        years_of_expertise: yearsOfExpertise || undefined,
        github: github || undefined,
        linkedin: linkedin || undefined,
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

  return (
    <div className="mx-auto max-w-2xl">
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
              />
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
              />
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
                {t("github")}
              </label>
              <input
                id="github"
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                dir="ltr"
              />
            </div>

            <div>
              <label
                htmlFor="linkedin"
                className="mb-1 block text-sm font-medium text-foreground-muted"
              >
                {t("linkedin")}
              </label>
              <input
                id="linkedin"
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                dir="ltr"
              />
            </div>

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
    </div>
  );
}
