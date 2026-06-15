/**
 * Server-side session utilities for the dual-server architecture.
 * These run exclusively in Next.js route handlers and server components.
 *
 * The frontend stores tokens in HTTP-only cookies only.
 * These helpers read cookies, validate tokens via the backend,
 * and optionally attempt secure refresh.
 */
import { backendGet, backendPost } from "@/lib/api/backend-client";
import { COOKIE_NAMES, COOKIE_OPTIONS } from "@/lib/auth/cookies";
import type { AuthUser, UserRole } from "@/lib/auth/types";

interface CurrentUserResponse {
  id: string;
  username: string;
  email?: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone_number?: string;
  profile_image?: string;
  is_active: boolean;
  is_verified?: boolean;
  job_title?: string;
  is_available?: boolean;
  rating?: number;
  total_reviews?: number;
}

/**
 * Fetch the current user from the backend using the access token.
 */
export async function fetchServerUser(
  accessToken: string
): Promise<AuthUser | null> {
  try {
    const { data } = await backendGet<CurrentUserResponse>(
      "/api/accounts/me/",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!data || !data.id) return null;

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      phoneNumber: data.phone_number,
      firstName: data.first_name,
      lastName: data.last_name,
      fullName: `${data.first_name} ${data.last_name}`.trim(),
      role: data.role,
      profileImage: data.profile_image,
      jobTitle: data.job_title,
      isActive: data.is_active,
      isVerified: data.is_verified ?? false,
      isAvailable: data.is_available,
      rating: data.rating,
      totalReviews: data.total_reviews,
    };
  } catch {
    return null;
  }
}

interface RefreshResult {
  user: AuthUser | null;
  accessToken: string | null;
}

/**
 * Attempt a secure token refresh using the refresh cookie.
 * Returns the new access token and user data on success.
 */
export async function attemptRefresh(
  refreshToken: string
): Promise<RefreshResult> {
  try {
    const { data } = await backendPost<{ access: string }>(
      "/api/auth/refresh/",
      { refresh: refreshToken }
    );

    if (!data?.access) return { user: null, accessToken: null };

    // Fetch user with the new access token
    const user = await fetchServerUser(data.access);
    return { user, accessToken: data.access };
  } catch {
    return { user: null, accessToken: null };
  }
}

/**
 * Get authenticated user from the request, attempting refresh if needed.
 * Returns { user, accessToken } or { user: null, accessToken: null }.
 */
export async function getServerUser(
  accessToken: string | undefined,
  refreshToken: string | undefined
): Promise<{ user: AuthUser | null; accessToken: string | null }> {
  // No tokens at all
  if (!accessToken) {
    return { user: null, accessToken: null };
  }

  // Try with existing access token
  const user = await fetchServerUser(accessToken);
  if (user) {
    return { user, accessToken };
  }

  // Access token expired — try refresh
  if (refreshToken) {
    const result = await attemptRefresh(refreshToken);
    return result;
  }

  return { user: null, accessToken: null };
}
