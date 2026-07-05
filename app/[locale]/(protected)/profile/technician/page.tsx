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
  updateTechnicianSkills,
  buildTechnicianSkillsPayload,
  validateTechnicianSkillsSelection,
  uploadTechnicianDocument,
  uploadTechnicianProfileImage,
  uploadTechnicianImage,
  deleteTechnicianImage,
  type TechnicianProfileData,
  type IncompleteFieldsData,
} from "@/lib/api/profiles";
import { fetchCategories } from "@/lib/marketplace/api";
import type { CategoryItem, SkillItem, SubSkillItem } from "@/lib/marketplace/types";

export default function TechnicianProfilePage() {
  const t = useTranslations("profile");
  const locale = useLocale();

  const [profile, setProfile] = useState<TechnicianProfileData | null>(null);
  const [incomplete, setIncomplete] = useState<IncompleteFieldsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillsSaving, setSkillsSaving] = useState(false);
  const [documentUploading, setDocumentUploading] = useState(false);
  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [referenceError, setReferenceError] = useState("");
  const [referenceLoading, setReferenceLoading] = useState(false);

  // Editable fields
  const [jobTitle, setJobTitle] = useState("");
  const [about, setAbout] = useState("");
  const [yearsOfExpertise, setYearsOfExpertise] = useState(0);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [selectedSubSkillIds, setSelectedSubSkillIds] = useState<string[]>([]);
  const [portfolioDescription, setPortfolioDescription] = useState("");
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
      setSelectedCategoryIds(getSelectedIds(profileData.skill_sets, "categories", "categories_detail"));
      setSelectedSkillIds(getSelectedIds(profileData.skill_sets, "skills", "skills_detail"));
      setSelectedSubSkillIds(getSelectedIds(profileData.skill_sets, "sub_skills", "sub_skills_detail"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const loadReferences = useCallback(async () => {
    setReferenceLoading(true);
    setReferenceError("");
    try {
      const categoryData = await fetchCategories({ page_size: 100 });
      setCategories(categoryData.results);
    } catch {
      setReferenceError(t("skillReferenceLoadError"));
    } finally {
      setReferenceLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadReferences();
  }, [loadReferences]);

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

  const handleSkillsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateTechnicianSkillsSelection({ skills: selectedSkillIds, sub_skills: selectedSubSkillIds })) {
      setError(t("chooseAtLeastOneSkill"));
      return;
    }
    setSkillsSaving(true);
    try {
      const updatedSkills = await updateTechnicianSkills(buildTechnicianSkillsPayload({
        categories: selectedCategoryIds,
        skills: selectedSkillIds,
        sub_skills: selectedSubSkillIds,
      }));
      setProfile((current) => current ? { ...current, skill_sets: { ...updatedSkills } } : current);
      setSuccess(t("skillsSaved"));
      setIncomplete(await fetchIncompleteFields());
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveError"));
    } finally {
      setSkillsSaving(false);
    }
  };

  const handleDocumentUpload = async (file: File | null) => {
    if (!file) return;
    setError("");
    setSuccess("");
    setDocumentUploading(true);
    try {
      const updated = await uploadTechnicianDocument(file);
      setProfile(updated);
      setIncomplete(await fetchIncompleteFields());
      setSuccess(t("saved"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveError"));
    } finally {
      setDocumentUploading(false);
    }
  };

  const handleProfileImageUpload = async (file: File | null) => {
    if (!file) return;
    setError("");
    setSuccess("");
    setProfileImageUploading(true);
    try {
      const updated = await uploadTechnicianProfileImage(file);
      setProfile(updated);
      setIncomplete(await fetchIncompleteFields());
      setSuccess(t("saved"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveError"));
    } finally {
      setProfileImageUploading(false);
    }
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    setError("");
    setSuccess("");
    setImageUploading(true);
    try {
      await uploadTechnicianImage(file, portfolioDescription || undefined);
      setPortfolioDescription("");
      await loadProfile();
      setSuccess(t("saved"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveError"));
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageDelete = async (imageId: string) => {
    setError("");
    setSuccess("");
    try {
      await deleteTechnicianImage(imageId);
      await loadProfile();
      setSuccess(t("saved"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveError"));
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
  const allSkills = uniqueById(categories.flatMap((category) => category.skills ?? []));
  const allSubSkills = uniqueById(allSkills.flatMap((skill) => skill.subSkills ?? []));
  const selectedCategoryNames = getNamesForIds(categories, selectedCategoryIds);
  const selectedSkillNames = getNamesForIds(allSkills, selectedSkillIds);
  const selectedSubSkillNames = getNamesForIds(allSubSkills, selectedSubSkillIds);

  const toggleCategory = (category: CategoryItem) => {
    const skillIds = (category.skills ?? []).map((skill) => skill.id);
    const subSkillIds = (category.skills ?? []).flatMap((skill) => (skill.subSkills ?? []).map((subSkill) => subSkill.id));
    setSelectedCategoryIds((current) => toggleId(current, category.id));
    if (selectedCategoryIds.includes(category.id)) {
      setSelectedSkillIds((current) => current.filter((id) => !skillIds.includes(id)));
      setSelectedSubSkillIds((current) => current.filter((id) => !subSkillIds.includes(id)));
    }
  };

  const toggleSkill = (category: CategoryItem, skill: SkillItem) => {
    setSelectedCategoryIds((current) => addUnique(current, category.id));
    setSelectedSkillIds((current) => toggleId(current, skill.id));
    if (selectedSkillIds.includes(skill.id)) {
      const subSkillIds = (skill.subSkills ?? []).map((subSkill) => subSkill.id);
      setSelectedSubSkillIds((current) => current.filter((id) => !subSkillIds.includes(id)));
    }
  };

  const toggleSubSkill = (category: CategoryItem, subSkill: SubSkillItem) => {
    setSelectedCategoryIds((current) => addUnique(current, category.id));
    setSelectedSubSkillIds((current) => toggleId(current, subSkill.id));
  };

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
              <div className="grid gap-2 text-sm">
                <label htmlFor="profileImage" className="text-foreground-muted">
                  {t("fields.profile_image")}
                </label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleProfileImageUpload(event.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
                />
                {profileImageUploading && (
                  <p className="flex items-center gap-2 text-xs text-foreground-muted">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {t("uploading")}
                  </p>
                )}
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
              <div className="grid gap-2 text-sm">
                <label htmlFor="identificationDocuments" className="text-foreground-muted">
                  {t("replaceDocument")}
                </label>
                <input
                  id="identificationDocuments"
                  type="file"
                  onChange={(event) => handleDocumentUpload(event.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
                />
                {documentUploading && (
                  <p className="flex items-center gap-2 text-xs text-foreground-muted">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {t("uploading")}
                  </p>
                )}
              </div>
              <LinkRow label={t("github")} href={profile?.github || profile?.url1} fallback={t("notProvided")} />
              <LinkRow label={t("linkedin")} href={profile?.linkedin || profile?.url2} fallback={t("notProvided")} />
            </div>
            <form className="space-y-4" onSubmit={handleSkillsSubmit}>
              {referenceError && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                  <span>{referenceError}</span>
                  <Button type="button" variant="outline" size="sm" onClick={loadReferences} disabled={referenceLoading}>
                    {referenceLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {t("tryAgain")}
                  </Button>
                </div>
              )}
              {referenceLoading && categories.length === 0 ? (
                <p className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm text-foreground-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("loadingSkills")}
                </p>
              ) : null}
              {categories.length > 0 ? (
                <SkillSelectionTree
                  categories={categories}
                  selectedCategoryIds={selectedCategoryIds}
                  selectedSkillIds={selectedSkillIds}
                  selectedSubSkillIds={selectedSubSkillIds}
                  onToggleCategory={toggleCategory}
                  onToggleSkill={toggleSkill}
                  onToggleSubSkill={toggleSubSkill}
                  labels={{
                    category: t("category"),
                    selectMultipleSkills: t("selectMultipleSkills"),
                    subSkills: t("subSkills"),
                  }}
                />
              ) : null}
              <div className="grid gap-3">
                <ChipGroup label={t("selectedSkills")} items={selectedSkillNames} emptyLabel={t("noSkillsSelected")} />
                <ChipGroup label={t("selectedSubSkills")} items={selectedSubSkillNames} emptyLabel={t("noSkillsSelected")} />
                <ChipGroup label={t("categories")} items={selectedCategoryNames} emptyLabel={t("notProvided")} />
                <ChipGroup label={t("currentSelection")} items={[...skillCategories, ...skillItems, ...subSkillItems]} emptyLabel={t("notProvided")} />
              </div>
              <Button type="submit" disabled={skillsSaving}>
                {skillsSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("saving")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("saveSkills")}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("portfolioImages")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-[1fr_1fr_auto]">
              <div className="grid gap-2">
                <label htmlFor="portfolioDescription" className="text-sm text-foreground-muted">
                  {t("imageDescription")}
                </label>
                <input
                  id="portfolioDescription"
                  type="text"
                  value={portfolioDescription}
                  onChange={(event) => setPortfolioDescription(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="portfolioImage" className="text-sm text-foreground-muted">
                  {t("addPortfolioImage")}
                </label>
                <input
                  id="portfolioImage"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImageUpload(event.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
                />
              </div>
              <div className="flex items-end">
                <Button type="button" disabled={imageUploading}>
                  {imageUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {portfolioImages.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {portfolioImages.map((image) => (
                  <div
                    key={image.id || image.image}
                    className="overflow-hidden rounded-lg border border-border bg-background"
                  >
                    <a href={image.image} target="_blank" rel="noreferrer" className="block">
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
                    </a>
                    <div className="space-y-1 p-3">
                      <p className="line-clamp-2 text-sm">{image.description || t("portfolioImage")}</p>
                      <p className="text-xs text-foreground-muted">{formatDate(image.uploaded_at, locale)}</p>
                      {image.id && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleImageDelete(image.id)}
                        >
                          {t("deleteImage")}
                        </Button>
                      )}
                    </div>
                  </div>
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

function SkillSelectionTree({
  categories,
  selectedCategoryIds,
  selectedSkillIds,
  selectedSubSkillIds,
  onToggleCategory,
  onToggleSkill,
  onToggleSubSkill,
  labels,
}: {
  categories: CategoryItem[];
  selectedCategoryIds: string[];
  selectedSkillIds: string[];
  selectedSubSkillIds: string[];
  onToggleCategory: (category: CategoryItem) => void;
  onToggleSkill: (category: CategoryItem, skill: SkillItem) => void;
  onToggleSubSkill: (category: CategoryItem, subSkill: SubSkillItem) => void;
  labels: { category: string; selectMultipleSkills: string; subSkills: string };
}) {
  return (
    <div className="grid gap-3 text-sm" aria-label={labels.selectMultipleSkills}>
      {categories.map((category) => (
        <details key={category.id} open className="rounded-lg border border-border bg-background p-3">
          <summary className="cursor-pointer list-none">
            <label className="flex cursor-pointer items-center gap-2 font-medium">
              <input
                type="checkbox"
                checked={selectedCategoryIds.includes(category.id)}
                onClick={(event) => event.stopPropagation()}
                onChange={() => onToggleCategory(category)}
                className="h-4 w-4 rounded border-border"
              />
              <span>{labels.category}: {category.name}</span>
            </label>
          </summary>
          <div className="mt-3 grid gap-3 border-t border-border pt-3">
            {(category.skills ?? []).map((skill) => (
              <div key={skill.id} className="grid gap-2 rounded-md bg-muted/30 p-3">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSkillIds.includes(skill.id)}
                    onClick={(event) => event.stopPropagation()}
                    onChange={() => onToggleSkill(category, skill)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span>{skill.name}</span>
                </label>
                {(skill.subSkills ?? []).length > 0 && (
                  <div className="ml-6 grid gap-2">
                    <span className="text-xs font-medium text-foreground-muted">{labels.subSkills}</span>
                    {(skill.subSkills ?? []).map((subSkill) => (
                      <label key={subSkill.id} className="flex cursor-pointer items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={selectedSubSkillIds.includes(subSkill.id)}
                          onClick={(event) => event.stopPropagation()}
                          onChange={() => onToggleSubSkill(category, subSkill)}
                          className="h-3.5 w-3.5 rounded border-border"
                        />
                        <span>{subSkill.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

function uniqueById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function addUnique(items: string[], id: string) {
  return items.includes(id) ? items : [...items, id];
}

function toggleId(items: string[], id: string) {
  return items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
}

function getNamesForIds(items: Array<{ id: string; name: string }>, ids: string[]) {
  const byId = new Map(items.map((item) => [item.id, item.name]));
  return ids.map((id) => byId.get(id)).filter((name): name is string => Boolean(name));
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

function getSelectedIds(
  source: Record<string, unknown> | null | undefined,
  idKey: string,
  detailKey: string
) {
  if (!source) return [];
  const ids = source[idKey];
  if (Array.isArray(ids)) return ids.map(String).filter(Boolean);
  const detail = source[detailKey];
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "id" in item) {
          return String((item as { id?: unknown }).id || "");
        }
        return "";
      })
      .filter(Boolean);
  }
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
