"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Skeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import {
  fetchTechnicianPublicProfile,
  type PublicTechnicianProfile,
} from "@/lib/api/marketplace";

export default function PublicTechnicianProfilePage() {
  const t = useTranslations("marketplace");
  const tTech = useTranslations("publicProfile");
  const params = useParams();
  const router = useRouter();
  const publicId = params.publicId as string;

  const [profile, setProfile] = useState<PublicTechnicianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const data = await fetchTechnicianPublicProfile(publicId);
      setProfile(data);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("404") || err.message.includes("not found")) {
          setNotFound(true);
        } else {
          setError(err.message);
        }
      } else {
        setError(t("loadError"));
      }
    } finally {
      setLoading(false);
    }
  }, [publicId, t]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ── Loading state ───────────────────────────────────────────
  if (loading) {
    return (
      <>
        <PublicHeader />
        <main id="main-content">
          <ResponsiveContainer className="py-8 sm:py-12">
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="flex items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </ResponsiveContainer>
        </main>
        <PublicFooter />
      </>
    );
  }

  // ── Not found ───────────────────────────────────────────────
  if (notFound) {
    return (
      <>
        <PublicHeader />
        <main id="main-content">
          <ResponsiveContainer className="py-8 sm:py-12">
            <ErrorState
              title={t("profileNotFound")}
              message={t("profileNotFoundDesc")}
              onRetry={() => router.push("/marketplace")}
              retryLabel={t("backToMarketplace")}
            />
          </ResponsiveContainer>
        </main>
        <PublicFooter />
      </>
    );
  }

  // ── Error state ─────────────────────────────────────────────
  if (error || !profile) {
    return (
      <>
        <PublicHeader />
        <main id="main-content">
          <ResponsiveContainer className="py-8 sm:py-12">
            <ErrorState
              title={t("loadError")}
              message={error || undefined}
              onRetry={loadProfile}
            />
          </ResponsiveContainer>
        </main>
        <PublicFooter />
      </>
    );
  }

  // ── Skills extraction ───────────────────────────────────────
  const skills = profile.skill_sets?.skills_detail as Array<{ id: string; name: string }> | undefined;
  const categories = profile.skill_sets?.categories_detail as Array<{ id: string; name: string }> | undefined;

  return (
    <>
      <PublicHeader />
      <main id="main-content">
        <ResponsiveContainer className="py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            {/* Back link */}
            <button
              type="button"
              onClick={() => router.push("/marketplace")}
              className="mb-6 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t("backToMarketplace")}
            </button>

            {/* Profile header */}
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                {profile.profile_image ? (
                  <Image
                    src={profile.profile_image}
                    alt={profile.full_name}
                    fill
                    className="object-cover"
                    sizes="112px"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-3xl font-semibold text-gray-500 dark:text-gray-400" aria-hidden="true">
                    {profile.full_name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.full_name}
                </h1>
                {profile.job_title && (
                  <p className="text-lg text-gray-500 dark:text-gray-400">{profile.job_title}</p>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400 sm:justify-start">
                  {profile.governorate && (
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {profile.governorate}
                    </span>
                  )}
                  {profile.years_of_expertise > 0 && (
                    <span>{tTech("yearsOfExpertise", { years: profile.years_of_expertise })}</span>
                  )}
                  {Number(profile.rate) > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {Number(profile.rate).toFixed(1)}
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1 ${profile.is_available ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                    <span className={`h-2 w-2 rounded-full ${profile.is_available ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`} aria-hidden="true" />
                    {profile.is_available ? t("available") : t("notAvailable")}
                  </span>
                </div>
              </div>
            </div>

            {/* About */}
            {profile.about && (
              <section className="mt-8" aria-labelledby="about-heading">
                <h2 id="about-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tTech("about")}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {profile.about}
                </p>
              </section>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
              <section className="mt-8" aria-labelledby="skills-heading">
                <h2 id="skills-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tTech("skills")}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Categories */}
            {categories && categories.length > 0 && (
              <section className="mt-6" aria-labelledby="categories-heading">
                <h2 id="categories-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tTech("categories")}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Portfolio images */}
            {profile.images && profile.images.length > 0 && (
              <section className="mt-8" aria-labelledby="portfolio-heading">
                <h2 id="portfolio-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tTech("portfolio")}
                </h2>
                <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {profile.images.map((img) => (
                    <div key={img.id} className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <Image
                        src={img.image}
                        alt={img.description || tTech("portfolioImage")}
                        width={400}
                        height={300}
                        className="h-40 w-full object-cover transition-transform group-hover:scale-105"
                        unoptimized
                      />
                      {img.description && (
                        <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                          {img.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* External links */}
            {(profile.url1 || profile.url2) && (
              <section className="mt-8" aria-labelledby="links-heading">
                <h2 id="links-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tTech("links")}
                </h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {profile.url1 && (
                    <a
                      href={profile.url1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:underline dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {profile.url2 && (
                    <a
                      href={profile.url2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:underline dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Last active */}
            {profile.last_active && (
              <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
                {tTech("lastActive", { date: new Date(profile.last_active).toLocaleDateString() })}
              </p>
            )}
          </div>
        </ResponsiveContainer>
      </main>
      <PublicFooter />
    </>
  );
}
