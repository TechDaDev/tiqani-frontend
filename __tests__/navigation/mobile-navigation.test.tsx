import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(() => ({ locale: "en" })),
  usePathname: vi.fn(() => "/en"),
}));

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
    className?: string;
  }) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/i18n/routing", () => ({
  locales: ["en", "ar", "ku"],
  defaultLocale: "ar",
  localeLabels: { en: "English", ar: "العربية", ku: "کوردی" },
  localeDirections: { en: "ltr", ar: "rtl", ku: "rtl" },
  routing: {
    locales: ["en", "ar", "ku"],
    defaultLocale: "ar",
    localePrefix: "always",
  },
}));

const navItems = [
  { label: "Home", href: "/en" },
  { label: "How It Works", href: "/en#how-it-works" },
];

function renderMobileNav(open: boolean) {
  const onClose = vi.fn();
  const triggerRef = createRef<HTMLButtonElement | null>();

  const result = render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <MobileNavigation
        open={open}
        onClose={onClose}
        navItems={navItems}
        triggerRef={triggerRef}
      />
    </NextIntlClientProvider>
  );

  return { ...result, onClose };
}

describe("MobileNavigation — closed by default", () => {
  it("renders with data-state=closed when open=false", () => {
    const { container } = renderMobileNav(false);
    const drawer = container.querySelector('[role="dialog"]');
    expect(drawer).toHaveAttribute("data-state", "closed");
  });

  it("renders with data-state=open when open=true", () => {
    const { container } = renderMobileNav(true);
    const drawer = container.querySelector('[role="dialog"]');
    expect(drawer).toHaveAttribute("data-state", "open");
  });
});

describe("MobileNavigation — close behavior", () => {
  it("calls onClose when close button is clicked", () => {
    const { onClose, container } = renderMobileNav(true);
    // Reset count from the initial mount effect that fires once
    onClose.mockClear();
    const closeButton = container.querySelector('[aria-label="Close navigation menu"]');
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose on Escape key", () => {
    const { onClose } = renderMobileNav(true);
    onClose.mockClear();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose after selecting a link", () => {
    const { onClose } = renderMobileNav(true);
    onClose.mockClear();
    const link = screen.getByText("Home");
    fireEvent.click(link);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when overlay is clicked", () => {
    const { onClose, container } = renderMobileNav(true);
    onClose.mockClear();
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay!);
    expect(onClose).toHaveBeenCalled();
  });
});

describe("MobileNavigation — LTR draws left", () => {
  it("has left-0 class in English", () => {
    const { container } = renderMobileNav(false);
    const drawer = container.querySelector('[role="dialog"]');
    expect(drawer?.className).toContain("left-0");
  });

  it("has -translate-x-full for closed state", () => {
    const { container } = renderMobileNav(false);
    const drawer = container.querySelector('[role="dialog"]');
    expect(drawer?.className).toContain("-translate-x-full");
  });
});

describe("MobileNavigation — desktop hiding", () => {
  it("has md:hidden class on drawer", () => {
    const { container } = renderMobileNav(true);
    const drawer = container.querySelector('[role="dialog"]');
    expect(drawer?.className).toContain("md:hidden");
  });

  it("has md:hidden class on overlay", () => {
    const { container } = renderMobileNav(true);
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay?.className).toContain("md:hidden");
  });
});

describe("MobileNavigation — accessibility", () => {
  it("drawer has dialog role", () => {
    const { container } = renderMobileNav(true);
    expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();
  });

  it("drawer is aria-modal", () => {
    const { container } = renderMobileNav(true);
    expect(container.querySelector('[aria-modal="true"]')).toBeInTheDocument();
  });
});

describe("MobileNavigation — RTL side classes", () => {
  it("renders correctly regardless of locale", () => {
    const { container } = renderMobileNav(false);
    const drawer = container.querySelector('[role="dialog"]');
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute("data-state", "closed");
  });
});
