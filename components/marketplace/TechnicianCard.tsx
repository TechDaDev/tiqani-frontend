"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import type { TechnicianListItem } from "@/lib/api/marketplace";

interface TechnicianCardProps {
  technician: TechnicianListItem;
}

export function TechnicianCard({ technician }: TechnicianCardProps) {
  const t = useTranslations("marketplace");

  const initial = technician.full_name?.charAt(0)?.toUpperCase() || "?";

  return (
    <Link
      href={`/marketplace/technicians/${technician.user_id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
      aria-label={t("viewProfile", { name: technician.full_name })}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          {technician.profile_image ? (
            <Image
              src={technician.profile_image}
              alt={technician.full_name}
              fill
              className="object-cover"
              sizes="64px"
              unoptimized
            />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-500 dark:text-gray-400"
              aria-hidden="true"
            >
              {initial}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-gray-900 dark:text-white">
            {technician.full_name}
          </h3>
          {technician.job_title && (
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
              {technician.job_title}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            {technician.governorate && (
              <span className="inline-flex items-center gap-1">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {technician.governorate}
              </span>
            )}
            {technician.years_of_expertise > 0 && (
              <span>{t("yearsOfExpertise", { years: technician.years_of_expertise })}</span>
            )}
            <span
              className={`inline-flex items-center gap-1 ${
                technician.is_available
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  technician.is_available ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-hidden="true"
              />
              {technician.is_available ? t("available") : t("notAvailable")}
            </span>
          </div>
        </div>

        {/* Rate */}
        {Number(technician.rate) > 0 && (
          <div className="flex flex-shrink-0 items-center gap-1">
            <svg
              className="h-4 w-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Number(technician.rate).toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* About preview */}
      {technician.about && (
        <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {technician.about}
        </p>
      )}
    </Link>
  );
}
