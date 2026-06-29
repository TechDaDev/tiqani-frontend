"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Loader2, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiClientError } from "@/lib/api/errors";
import {
  fetchClientProfile,
  updateClientProfile,
  updateClientProfileFormData,
  fetchIncompleteFields,
  type ClientProfileData,
  type IncompleteFieldsData,
} from "@/lib/api/profiles";
import type { Locale } from "@/lib/i18n/routing";

const IRAQI_GOVERNORATES = [
  "Baghdad", "Basra", "Nineveh", "Erbil", "Sulaymaniyah",
  "Kirkuk", "Duhok", "Najaf", "Karbala", "Anbar", "Babil",
  "Maysan", "Wasit", "Dhi Qar", "Muthanna", "Qadisiyyah",
  "Salah al-Din", "Diyala", "Halabja",
] as const;

export default function ClientProfilePage() {
  const t = useTranslations("profile");
  const params = useParams();
  const locale = (params.locale as Locale) || "ar";

  const [profile, setProfile] = useState<ClientProfileData | null>(null);
  const [incomplete, setIncomplete] = useState<IncompleteFieldsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Editable fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState<"" | "male" | "female">("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const [profileData, incompleteData] = await Promise.all([
        fetchClientProfile(),
        fetchIncompleteFields(),
      ]);
      setProfile(profileData);
      setIncomplete(incompleteData);
      setPhoneNumber(profileData.phone_number || "");
      setGovernorate(profileData.governorate || "");
      setAddress(profileData.address || "");
      setGender((profileData.gender as "male" | "female" | null) || "");
      setDateOfBirth(profileData.date_of_birth || "");
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
      const updated = await updateClientProfile({
        phone_number: phoneNumber || undefined,
        governorate: governorate || undefined,
        address: address || undefined,
        gender: gender || undefined,
        date_of_birth: dateOfBirth || undefined,
      });
      let refreshed = updated;
      if (profileImageFile) {
        const data = new FormData();
        data.append("profile_image", profileImageFile);
        refreshed = await updateClientProfileFormData(data);
        setProfileImageFile(null);
      }
      setProfile(refreshed);
      setSuccess(t("saved"));
      // Reload incomplete fields
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
      <h1 className="mb-8 text-3xl font-bold">{t("clientProfile")}</h1>

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
          <CardTitle>{t("personalInfo")}</CardTitle>
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
            {/* Read-only fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground-muted">
                  {t("fullName")}
                </label>
                <p className="rounded-lg border border-border bg-muted px-3 py-2 text-sm">
                  {profile?.full_name}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground-muted">
                  {t("email")}
                </label>
                <p className="rounded-lg border border-border bg-muted px-3 py-2 text-sm">
                  {profile?.email || "—"}
                </p>
              </div>
            </div>

            {/* Editable fields */}
            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-medium text-foreground-muted"
              >
                {t("phoneNumber")}
              </label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0770XXXXXXX"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                dir="ltr"
              />
            </div>

            <div>
              <label
                htmlFor="governorate"
                className="mb-1 block text-sm font-medium text-foreground-muted"
              >
                {t("governorate")}
              </label>
              <select
                id="governorate"
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{t("selectGovernorate")}</option>
                {IRAQI_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="address"
                className="mb-1 block text-sm font-medium text-foreground-muted"
              >
                {t("address")}
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="gender"
                  className="mb-1 block text-sm font-medium text-foreground-muted"
                >
                  {t("gender")}
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "" | "male" | "female")}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{t("selectGender")}</option>
                  <option value="male">{t("genders.male")}</option>
                  <option value="female">{t("genders.female")}</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="mb-1 block text-sm font-medium text-foreground-muted"
                >
                  {t("dateOfBirth")}
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="profileImage"
                className="mb-1 block text-sm font-medium text-foreground-muted"
              >
                {t("fields.profile_image")}
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImageFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {profile?.profile_image && (
                <p className="mt-1 text-xs text-foreground-muted">{t("uploaded")}</p>
              )}
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
