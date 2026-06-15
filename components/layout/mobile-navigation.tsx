"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { type Locale } from "@/lib/i18n/routing";

type NavItem = {
  label: string;
  href: string;
};

type MobileNavigationProps = {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  navItems: NavItem[];
};

export function MobileNavigation({
  isOpen,
  onClose,
  onToggle,
  navItems,
}: MobileNavigationProps) {
  const params = useParams();
  const locale = (params.locale as Locale) || "ar";
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("common");
  const isRtl = locale === "ar" || locale === "ku";

  // Close menu on route/locale change
  useEffect(() => {
    onClose();
  }, [pathname, locale, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key: close and return focus to trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Return focus to trigger on close
  const handleClose = useCallback(() => {
    onClose();
    triggerRef.current?.focus();
  }, [onClose]);

  // Close menu on viewport resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        onClose();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  // In RTL, drawer slides in from the right; in LTR, from the left
  const sideClasses = isRtl
    ? "right-0 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0"
    : "left-0 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0";

  return (
    <>
      {/* Mobile menu trigger — hidden on md+ */}
      <button
        ref={triggerRef}
        className="md:hidden rounded-md p-2 text-foreground-muted hover:bg-surface-subtle"
        onClick={onToggle}
        aria-label={isOpen ? t("closeMenu") : t("openMenu")}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay — hidden on desktop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel — hidden on desktop */}
      <div
        id="mobile-navigation"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("menu")}
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "fixed inset-y-0 z-50 w-72 bg-surface shadow-lg transition-transform duration-300 ease-in-out md:hidden",
          sideClasses,
          isOpen ? "translate-x-0" : ""
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Logo locale={locale} />
          <button
            onClick={handleClose}
            className="rounded-md p-2 text-foreground-muted hover:bg-surface-subtle hover:text-foreground"
            aria-label={t("closeMenu")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleClose}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary-soft text-primary"
                  : "text-foreground-muted hover:bg-surface-subtle hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
