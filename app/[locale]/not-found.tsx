import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer } from "@/components/shared/responsive-container";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NotFound({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <ResponsiveContainer>
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
          <p className="mt-2 text-foreground-muted">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link href={`/${locale}`}>
            <Button variant="primary" className="mt-6">
              Back to Home
            </Button>
          </Link>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
