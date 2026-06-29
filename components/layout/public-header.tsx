"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Menu } from "lucide-react";
import { LocaleLink } from "@/components/shared/locale-link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { ThemeSwitcher } from "@/components/controls/theme-switcher";
import { LanguageSwitcher } from "@/components/controls/language-switcher";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { type Locale } from "@/lib/i18n/routing";

export function PublicHeader() {
  const t = useTranslations("navigation");
  const common = useTranslations("common");
  const params = useParams();
  const locale = (params.locale as Locale) || "ar";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { user, isAuthenticated, isLoading } = useAuth();

  // Stabilize onClose so it never triggers unnecessary re-renders or effects
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t("home"), href: "/" },
    { label: t("howItWorks"), href: "/#how-it-works" },
    { label: t("services"), href: "/#services" },
    { label: t("whyTiqani"), href: "/#why-tiqani" },
    { label: t("technicians"), href: "/#technicians" },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-30 transition-all duration-300",
        isScrolled
          ? "border-b border-border bg-surface/80 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <ResponsiveContainer>
        <div className="flex h-16 items-center justify-between">
          <Logo locale={locale} />

          <nav className="hidden md:flex items-center gap-1" aria-label={t("home")}>
            {navItems.map((item) => (
              <LocaleLink
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-subtle hover:text-foreground"
              >
                {item.label}
              </LocaleLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeSwitcher />
            <LanguageSwitcher />

            <div className="hidden md:flex items-center gap-2 ms-2">
              {isLoading ? null : isAuthenticated && user ? (
                <>
                  <LocaleLink href="/account">
                    <Button variant="ghost" size="sm">
                      {user.fullName || user.username}
                    </Button>
                  </LocaleLink>
                </>
              ) : (
                <>
                  <LocaleLink href="/login">
                    <Button variant="ghost" size="sm">
                      {t("login")}
                    </Button>
                  </LocaleLink>
                  <LocaleLink href="/register">
                    <Button variant="primary" size="sm">
                      {t("createAccount")}
                    </Button>
                  </LocaleLink>
                </>
              )}
            </div>

            {/* Mobile menu trigger — inside the header flex row, hidden on md+ */}
            <button
              ref={triggerRef}
              type="button"
              className="md:hidden rounded-md p-2 text-foreground-muted hover:bg-surface-subtle"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? common("closeMenu") : common("openMenu")}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </ResponsiveContainer>

      <MobileNavigation
        open={isMenuOpen}
        onClose={closeMenu}
        navItems={navItems}
        triggerRef={triggerRef}
      />
    </header>
  );
}
