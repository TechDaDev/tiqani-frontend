/**
 * Offer card — summary view for list displays.
 */
import Link from "next/link";
import { useTranslations } from "next-intl";
import { OfferStatusBadge } from "./offer-status-badge";
import { MoneyDisplay } from "./money-display";
import type { Offer } from "@/lib/offers/types";

interface OfferCardProps {
  offer: Offer;
  href: string;
  role: "technician" | "client";
}

export function OfferCard({ offer, href, role }: OfferCardProps) {
  const t = useTranslations("offers");

  const participantName =
    role === "technician"
      ? offer.client?.full_name
      : offer.technician?.full_name;

  return (
    <Link
      href={href}
      className="block rounded-lg border border-border-warm bg-surface-pure p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-foreground dark:text-gray-100">
            {offer.request_title || t("offerDetail")}
          </h3>
          <p className="mt-1 text-xs text-foreground-muted dark:text-gray-400">
            {role === "technician" ? t("client") : t("technician")}: {participantName}
          </p>
          {offer.duration_days && (
            <p className="mt-0.5 text-xs text-foreground-muted dark:text-gray-400">
              {t("duration")}: {offer.duration_days}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <OfferStatusBadge status={offer.status} />
          <MoneyDisplay amount={offer.amount} />
        </div>
      </div>
      {offer.description && (
          <p className="mt-2 line-clamp-2 text-sm text-foreground-muted dark:text-gray-300">
          {offer.description}
        </p>
      )}
      <p className="mt-2 text-xs text-neutral-soft dark:text-gray-500">
        {new Date(offer.created_at).toLocaleDateString()}
      </p>
    </Link>
  );
}
