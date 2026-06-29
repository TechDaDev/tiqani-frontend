"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { LocaleLink } from "@/components/shared/locale-link";
import { Logo } from "@/components/shared/logo";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { LanguageSwitcher } from "@/components/controls/language-switcher";
import { type Locale } from "@/lib/i18n/routing";

type FooterLink = {
  label: string;
  href: string;
};

export function PublicFooter() {
  const t = useTranslations("footer");
  const params = useParams();
  const locale = (params.locale as Locale) || "en";

  const platformLinks: FooterLink[] = [
    { label: t("home"), href: "/" },
    { label: t("howItWorks"), href: "/#how-it-works" },
    { label: t("services"), href: "/#services" },
    { label: t("technicians"), href: "/#technicians" },
  ];

  const supportLinks: FooterLink[] = [
    { label: t("helpCenter"), href: "#" },
    { label: t("contact"), href: "#" },
    { label: t("safety"), href: "#" },
    { label: t("reportProblem"), href: "#" },
  ];

  const legalLinks: FooterLink[] = [
    { label: t("terms"), href: "#" },
    { label: t("privacy"), href: "#" },
    { label: t("contractNotice"), href: "#" },
  ];

  const accountLinks: FooterLink[] = [
    { label: t("login"), href: "/login" },
    { label: t("createAccount"), href: "/register" },
    { label: t("joinTechnician"), href: "/register?role=technician" },
  ];

  const renderLinks = (links: FooterLink[]) =>
    links.map((link) => (
      <LocaleLink
        key={link.label}
        href={link.href}
        className="text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        {link.label}
      </LocaleLink>
    ));

  return (
    <footer className="border-t border-border bg-surface" role="contentinfo">
      <ResponsiveContainer className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo locale={locale} />
            <p className="mt-3 text-sm text-foreground-muted">
              {t("description")}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-foreground-muted">
                <LanguageSwitcher />
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {t("platform")}
            </h3>
            <div className="flex flex-col gap-2">{renderLinks(platformLinks)}</div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {t("support")}
            </h3>
            <div className="flex flex-col gap-2">{renderLinks(supportLinks)}</div>
            <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">
              {t("legal")}
            </h3>
            <div className="flex flex-col gap-2">{renderLinks(legalLinks)}</div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {t("account")}
            </h3>
            <div className="flex flex-col gap-2">{renderLinks(accountLinks)}</div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-foreground-muted">
          <p>{t("copyright")}</p>
        </div>
      </ResponsiveContainer>
    </footer>
  );
}
