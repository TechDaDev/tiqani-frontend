"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import { X } from "lucide-react";
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
  navItems: NavItem[];
};

export function MobileNavigation({
  isOpen,
  onClose,
  navItems,
}: MobileNavigationProps) {
  const params = useParams();
  const locale = (params.locale as Locale) || "en";
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("common");

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("menu")}
        className={cn(
          "fixed inset-y-0 z-50 w-72 bg-surface shadow-lg transition-transform duration-300 ease-in-out",
          "start-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Logo locale={locale} />
          <button
            onClick={onClose}
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
              onClick={onClose}
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
