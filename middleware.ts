import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);
const localePattern = /^(\/(?:en|ar|ku))(?:\/(?:en|ar|ku))(?=\/|$)/;

export default function middleware(request: NextRequest) {
  const duplicateLocaleMatch = request.nextUrl.pathname.match(localePattern);

  if (duplicateLocaleMatch) {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.pathname.replace(
      localePattern,
      duplicateLocaleMatch[1]
    );
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
