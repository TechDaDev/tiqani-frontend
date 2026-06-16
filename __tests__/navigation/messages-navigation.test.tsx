/**
 * Tests for Messages navigation link in AuthShell.
 * Verifies the Messages nav item renders with correct route and unread badge.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

// Mock modules before any imports
vi.mock("@/components/auth/auth-provider", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/lib/messages/query", () => ({
  useUnreadCount: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) =>
    <a href={href} {...props}>{children}</a>,
}));

// Mock the i18n modules to avoid resolving next-intl subpath exports
vi.mock("@/lib/i18n/routing", () => ({
  routing: { locales: ["en", "ar", "ku"], defaultLocale: "ar" },
  locales: ["en", "ar", "ku"],
  defaultLocale: "ar",
  localeLabels: { en: "English", ar: "العربية", ku: "کوردی" },
}));

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string }) =>
    <a href={href} {...props}>{children}</a>,
  redirect: (url: string) => url,
  usePathname: () => "",
  useRouter: () => ({ push: () => {}, replace: () => {}, prefetch: () => {} }),
}));

import { useAuth } from "@/components/auth/auth-provider";
import { useUnreadCount } from "@/lib/messages/query";
import { useParams, usePathname } from "next/navigation";

const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;
const mockUseUnreadCount = useUnreadCount as ReturnType<typeof vi.fn>;
const mockUseParams = useParams as ReturnType<typeof vi.fn>;
const mockUsePathname = usePathname as ReturnType<typeof vi.fn>;

const messages = {
  profile: {
    title: "Profile",
    clientProfile: "Client Profile",
    technicianProfile: "Technician Profile",
    onboarding: "Onboarding",
  },
  account: {
    title: "Account",
  },
  navigation: {
    myRequests: "My Requests",
    incomingRequests: "Incoming Requests",
    messages: "Messages",
  },
  common: {
    logout: "Log out",
  },
  unreadMessages: {
    ariaLabel: "{count} unread {count, plural, one {message} other {messages}}",
  },
};

describe("Messages navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ locale: "en" });
    mockUsePathname.mockReturnValue("/en/account");
    mockUseUnreadCount.mockReturnValue({
      data: null,
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
    });
  });

  it("shows Messages link for client role", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "c1", role: "client", username: "client" },
      logout: vi.fn(),
    });

    const { AuthShell } = await import("@/components/profile/auth-shell");

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AuthShell>content</AuthShell>
      </NextIntlClientProvider>
    );

    expect(screen.getByText("Messages")).toBeInTheDocument();
  });

  it("shows Messages link for technician role", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "t1", role: "technician", username: "tech" },
      logout: vi.fn(),
    });

    const { AuthShell } = await import("@/components/profile/auth-shell");

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AuthShell>content</AuthShell>
      </NextIntlClientProvider>
    );

    expect(screen.getByText("Messages")).toBeInTheDocument();
  });

  it("Messages link routes to /en/messages", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "c1", role: "client", username: "client" },
      logout: vi.fn(),
    });

    const { AuthShell } = await import("@/components/profile/auth-shell");

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AuthShell>content</AuthShell>
      </NextIntlClientProvider>
    );

    const messagesLink = screen.getByText("Messages").closest("a");
    expect(messagesLink).toHaveAttribute("href", "/en/messages");
  });

  it("shows unread badge with count", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "c1", role: "client", username: "client" },
      logout: vi.fn(),
    });
    mockUseUnreadCount.mockReturnValue({
      data: { total_unread: 5, rooms: [] },
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
    });

    const { AuthShell } = await import("@/components/profile/auth-shell");

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AuthShell>content</AuthShell>
      </NextIntlClientProvider>
    );

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows 99+ for large unread count", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "c1", role: "client", username: "client" },
      logout: vi.fn(),
    });
    mockUseUnreadCount.mockReturnValue({
      data: { total_unread: 150, rooms: [] },
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
    });

    const { AuthShell } = await import("@/components/profile/auth-shell");

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AuthShell>content</AuthShell>
      </NextIntlClientProvider>
    );

    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("hides badge when unread count is zero", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "c1", role: "client", username: "client" },
      logout: vi.fn(),
    });
    mockUseUnreadCount.mockReturnValue({
      data: { total_unread: 0, rooms: [] },
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
    });

    const { AuthShell } = await import("@/components/profile/auth-shell");

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AuthShell>content</AuthShell>
      </NextIntlClientProvider>
    );

    // No blue badge should appear
    const badgeSpans = document.querySelectorAll(".inline-flex.items-center.justify-center");
    const visibleBadges = Array.from(badgeSpans).filter(
      (s) => s.textContent && /^\d+$/.test(s.textContent)
    );
    expect(visibleBadges.length).toBe(0);
  });
});
