"use client";

import { type ReactNode, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
  User,
  Briefcase,
  ClipboardList,
  ChevronRight,
  LogOut,
  Shield,
  Menu,
  X,
  Inbox,
  Send,
  MessageSquare,
  FileText,
  Handshake,
  Bell,
  Settings,
  LayoutDashboard,
  Users,
  Activity,
  Server,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUnreadCount } from "@/lib/messages/query";
import { fetchNotificationUnreadCount } from "@/lib/api/notifications";
import type { Locale } from "@/lib/i18n/routing";

type ShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: ShellProps) {
  const t = useTranslations("profile");
  const tAccount = useTranslations("account");
  const tNav = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const tOffers = useTranslations("offers");
  const tContracts = useTranslations("contracts");
  const { user, logout } = useAuth();
  const params = useParams();
  const pathname = usePathname();
  const locale = (params.locale as Locale) || "ar";
  const isRtl = locale === "ar" || locale === "ku";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationUnread, setNotificationUnread] = useState(0);
  const { data: unreadData, startPolling, stopPolling } = useUnreadCount();

  // Start/stop unread polling based on user session
  useEffect(() => {
    if (user) {
      startPolling();
    }
    return () => stopPolling();
  }, [user, startPolling, stopPolling]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const refresh = () => {
      fetchNotificationUnreadCount().then((count) => {
        if (active) setNotificationUnread(count);
      }).catch(() => undefined);
    };
    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [user]);

  if (!user) return null;

  const unreadTotal = unreadData?.total_unread ?? 0;
  const adminRoles = ["system_admin", "finance_admin", "account_manager", "content_moderator"];
  const accountManagerRoles = ["system_admin", "account_manager"];
  const systemAdminRoles = ["system_admin"];

  const navItems: Array<{
    label: string;
    href: string;
    icon: ReactNode;
    showFor: string[];
    badge?: number;
  }> = [
    {
      label: tAccount("title"),
      href: `/${locale}/account`,
      icon: <User className="h-4 w-4" />,
      showFor: ["client", "technician"],
    },
    {
      label: t("clientProfile"),
      href: `/${locale}/profile/client`,
      icon: <Shield className="h-4 w-4" />,
      showFor: ["client"],
    },
    {
      label: t("technicianProfile"),
      href: `/${locale}/profile/technician`,
      icon: <Briefcase className="h-4 w-4" />,
      showFor: ["technician"],
    },
    {
      label: tAccount("onboarding"),
      href: `/${locale}/onboarding`,
      icon: <ClipboardList className="h-4 w-4" />,
      showFor: ["technician"],
    },
    {
      label: tNav("messages"),
      href: `/${locale}/messages`,
      icon: <MessageSquare className="h-4 w-4" />,
      showFor: ["client", "technician"],
      badge: unreadTotal,
    },
    {
      label: tNav("notifications"),
      href: `/${locale}/notifications`,
      icon: <Bell className="h-4 w-4" />,
      showFor: ["client", "technician"],
      badge: notificationUnread,
    },
    {
      label: tNav("notificationSettings"),
      href: `/${locale}/settings/notifications`,
      icon: <Settings className="h-4 w-4" />,
      showFor: ["client", "technician"],
    },
    {
      label: "Admin Dashboard",
      href: `/${locale}/admin/dashboard`,
      icon: <LayoutDashboard className="h-4 w-4" />,
      showFor: adminRoles,
    },
    {
      label: "Users",
      href: `/${locale}/admin/users`,
      icon: <Users className="h-4 w-4" />,
      showFor: accountManagerRoles,
    },
    {
      label: "Technicians",
      href: `/${locale}/admin/technicians`,
      icon: <Briefcase className="h-4 w-4" />,
      showFor: accountManagerRoles,
    },
    {
      label: "Audit",
      href: `/${locale}/admin/audit`,
      icon: <Activity className="h-4 w-4" />,
      showFor: adminRoles,
    },
    {
      label: "System",
      href: `/${locale}/admin/system`,
      icon: <Server className="h-4 w-4" />,
      showFor: systemAdminRoles,
    },
    {
      label: tNav("myRequests"),
      href: `/${locale}/client/requests`,
      icon: <Send className="h-4 w-4" />,
      showFor: ["client"],
    },
    {
      label: tNav("incomingRequests"),
      href: `/${locale}/technician/requests`,
      icon: <Inbox className="h-4 w-4" />,
      showFor: ["technician"],
    },
    {
      label: tOffers("myOffers"),
      href: `/${locale}/technician/offers`,
      icon: <FileText className="h-4 w-4" />,
      showFor: ["technician"],
    },
    {
      label: tOffers("incomingOffers"),
      href: `/${locale}/offers`,
      icon: <Handshake className="h-4 w-4" />,
      showFor: ["client"],
    },
  ];

  const visibleNav = navItems.filter((item) => item.showFor.includes(user.role));

  const isActive = (href: string) => {
    if (href === pathname) return true;
    // Sub-pages match parent
    if (pathname.startsWith(href) && href !== `/${locale}/account`) return true;
    return false;
  };

  return (
    <>
      <PublicHeader />
      <main id="main-content" className="min-h-screen pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
            {/* Mobile menu toggle */}
            <div className="mb-4 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  {visibleNav.find((n) => isActive(n.href))?.icon}
                  {visibleNav.find((n) => isActive(n.href))?.label || tAccount("title")}
                </span>
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Sidebar navigation */}
            <nav
              className={cn(
                "flex-col gap-1 lg:flex",
                mobileMenuOpen ? "flex" : "hidden"
              )}
            >
              <div className="rounded-xl border border-border bg-card p-2">
                {visibleNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary text-white"
                        : "text-foreground-muted hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={cn(
                          "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium leading-none",
                          isActive(item.href)
                            ? "bg-surface-pure text-primary"
                            : "bg-blue-600 text-white"
                        )}
                        aria-label={`${item.badge} unread ${item.badge === 1 ? "message" : "messages"}`}
                      >
                        {item.badge > 99 ? "99+" : String(item.badge)}
                      </span>
                    )}
                    {isRtl ? (
                      <ChevronRight
                        className={cn(
                          "mr-auto h-4 w-4",
                          isActive(item.href) ? "text-white" : "text-foreground-muted"
                        )}
                      />
                    ) : (
                      <ChevronRight
                        className={cn(
                          "ml-auto h-4 w-4",
                          isActive(item.href) ? "text-white" : "text-foreground-muted"
                        )}
                      />
                    )}
                  </Link>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-border bg-card p-2">
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{tCommon("logout")}</span>
                </button>
              </div>
            </nav>

            {/* Main content area */}
            <div className="mt-6 lg:mt-0">{children}</div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
