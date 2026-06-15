"use client";

import { useTranslations } from "next-intl";

interface UnreadBadgeProps {
  count: number;
  max?: number;
}

export function UnreadBadge({ count, max = 99 }: UnreadBadgeProps) {
  const t = useTranslations("unreadMessages");
  if (count <= 0) return null;

  const display = count > max ? `${max}+` : String(count);

  return (
    <span
      className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-blue-600 text-white text-xs font-medium leading-none"
      aria-label={t("ariaLabel", { count })}
      role="status"
    >
      {display}
    </span>
  );
}
