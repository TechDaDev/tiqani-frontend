/**
 * Escrow-held notice — shown when work is completed but funds not released.
 */
import { useTranslations } from "next-intl";

interface EscrowHeldNoticeProps {
  amount?: string;
  className?: string;
}

export function EscrowHeldNotice({
  amount,
  className = "",
}: EscrowHeldNoticeProps) {
  const t = useTranslations("execution");

  return (
    <div
      className={`rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-200 ${className}`}
      role="status"
      aria-live="polite"
    >
      <p className="font-medium">{t("escrowHeldTitle")}</p>
      <p className="mt-1">
        {amount
          ? t("escrowHeldAmount", { amount })
          : t("escrowHeldNotice")}
      </p>
    </div>
  );
}
