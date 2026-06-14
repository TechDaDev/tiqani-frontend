import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  description?: string;
  className?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({
  title,
  description,
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <Tag className="text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </Tag>
      {description && (
        <p className="mt-4 text-lg text-foreground-muted">{description}</p>
      )}
    </div>
  );
}
