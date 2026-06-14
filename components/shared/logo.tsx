import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  locale: string;
  className?: string;
  showText?: boolean;
};

export function Logo({ locale, className, showText = true }: LogoProps) {
  return (
    <Link
      href={`/${locale}`}
      className={cn("flex items-center gap-2", className)}
      aria-label="Tiqani"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <span className="text-sm font-bold text-white">T</span>
      </div>
      {showText && (
        <span className="text-xl font-bold text-foreground">Tiqani</span>
      )}
    </Link>
  );
}
