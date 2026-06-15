/**
 * Centralized cookie configuration for authentication tokens.
 *
 * Architecture: Next.js server sets HTTP-only cookies after proxying
 * auth requests to Django. Browser JavaScript never reads token values.
 */

export const COOKIE_NAMES = {
  ACCESS: "tiqani_access",
  REFRESH: "tiqani_refresh",
} as const;

/** Access token: 120 minutes (matches Django SIMPLE_JWT default) */
const ACCESS_MAX_AGE_SEC = 120 * 60;
/** Refresh token: 7 days (matches Django SIMPLE_JWT default) */
const REFRESH_MAX_AGE_SEC = 7 * 24 * 60 * 60;

export const COOKIE_OPTIONS = {
  ACCESS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ACCESS_MAX_AGE_SEC,
  },
  REFRESH: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: REFRESH_MAX_AGE_SEC,
  },
} as const;
