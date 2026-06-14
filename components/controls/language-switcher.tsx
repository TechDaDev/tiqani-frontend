"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { locales, localeLabels, type Locale } from "@/lib/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const currentLocale = (params.locale as Locale) || "en";

  const cycleLocale = () => {
    const currentIndex = locales.indexOf(currentLocale);
    const nextIndex = (currentIndex + 1) % locales.length;
    const nextLocale = locales[nextIndex];
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleLocale}
      aria-label={`${t("language")}: ${localeLabels[currentLocale]}`}
      title={localeLabels[currentLocale]}
      className="gap-1"
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-medium uppercase">{currentLocale}</span>
    </Button>
  );
}
