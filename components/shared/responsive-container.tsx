import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ResponsiveContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer";
  id?: string;
};

export function ResponsiveContainer({
  children,
  className,
  as: Tag = "div",
  id,
}: ResponsiveContainerProps) {
  return (
    <Tag
      id={id}
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </Tag>
  );
}
