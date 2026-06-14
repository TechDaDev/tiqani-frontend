import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { defaultLocale, locales } from "@/lib/i18n/routing";

export default async function RootPage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("NEXT_LOCALE")?.value;

  if (savedLocale && locales.includes(savedLocale as any)) {
    redirect(`/${savedLocale}`);
  }

  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";
  const preferred = acceptLanguage
    .split(",")
    .map((l) => l.split(";")[0].trim().split("-")[0])
    .find((l) => locales.includes(l as any));

  if (preferred) {
    redirect(`/${preferred}`);
  }

  redirect(`/${defaultLocale}`);
}
