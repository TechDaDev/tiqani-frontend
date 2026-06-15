"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("common");

  const themes = [
    { value: "light", label: t("lightMode"), icon: Sun },
    { value: "dark", label: t("darkMode"), icon: Moon },
    { value: "system", label: t("systemTheme"), icon: Monitor },
  ] as const;

  const currentTheme = themes.find((t) => t.value === theme) ?? themes[0];
  const Icon = currentTheme.icon;

  const cycleTheme = () => {
    const currentIndex = themes.findIndex((t) => t.value === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].value);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      aria-label={`${t("theme")} — ${currentTheme.label}`}
      title={currentTheme.label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
