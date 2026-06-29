"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";
import { locales, type Locale } from "@/lib/i18n/routing";

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

function isExternalHref(href: string) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href);
}

function withLocale(href: string, locale: Locale) {
  if (isExternalHref(href)) return href;

  const [pathWithHash, query = ""] = href.split("?", 2);
  const [path = "", hash = ""] = pathWithHash.split("#", 2);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const segments = normalizedPath.split("/");
  const pathWithoutLocale = locales.includes(segments[1] as Locale)
    ? `/${segments.slice(2).join("/")}`.replace(/\/$/, "") || "/"
    : normalizedPath;
  const localizedPath =
    pathWithoutLocale === "/" ? `/${locale}` : `/${locale}${pathWithoutLocale}`;
  const queryPart = query ? `?${query}` : "";
  const hashPart = hash ? `#${hash}` : "";

  return `${localizedPath}${queryPart}${hashPart}`;
}

export function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const params = useParams();
  const locale = locales.includes(params.locale as Locale)
    ? (params.locale as Locale)
    : "ar";

  return <Link href={withLocale(href, locale)} {...props} />;
}
