import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { defaultLocale, locales } from "@/lib/i18n/routing";

export default async function RootPage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("NEXT_LOCALE")?.value;

  if (savedLocale && locales.includes(savedLocale as any)) {
    redirect(`/${savedLocale}`);
  }

  // Default to Arabic for first visits without a saved locale cookie
  redirect(`/${defaultLocale}`);
}
