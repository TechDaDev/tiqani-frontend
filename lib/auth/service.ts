import { browserRequest } from "@/lib/api/browser-client";
import type {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  CurrentUserResponse,
  AuthUser,
} from "./types";
import { mapCurrentUserData, mapLoginUserData } from "./types";

/**
 * Login — calls same-origin Next.js proxy route.
 * Tokens are stored in HTTP-only cookies by the server.
 */
export async function login(request: LoginRequest): Promise<AuthUser> {
  const response = await browserRequest<{ userdata: Record<string, unknown> }>("/api/auth/login", {
    method: "POST",
    body: request,
  });
  return mapLoginUserData(response.userdata);
}

/**
 * Register — calls same-origin Next.js proxy route.
 */
export async function register(request: RegisterRequest): Promise<RegisterResponse> {
  return browserRequest<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: request,
  });
}

/**
 * Verify email OTP — calls same-origin Next.js proxy route.
 */
export async function verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
  return browserRequest<VerifyEmailResponse>("/api/auth/verify-otp", {
    method: "POST",
    body: request,
  });
}

/**
 * Resend OTP — calls same-origin Next.js proxy route.
 */
export async function resendOtp(request: ResendOtpRequest): Promise<ResendOtpResponse> {
  return browserRequest<ResendOtpResponse>("/api/auth/resend-otp", {
    method: "POST",
    body: request,
  });
}

/**
 * Refresh access token — calls same-origin Next.js proxy route.
 * Server reads the HTTP-only refresh cookie and sets a new access cookie.
 */
export async function refreshToken(): Promise<boolean> {
  try {
    await browserRequest<{ refreshed: boolean }>("/api/auth/refresh", {
      method: "POST",
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Logout — calls same-origin Next.js proxy route.
 * Server clears auth cookies and blacklists refresh token on Django.
 */
export async function logoutFn(): Promise<void> {
  try {
    await browserRequest<{ detail: string }>("/api/auth/logout", {
      method: "POST",
    });
  } catch {
    // Best-effort
  }
}

/**
 * Forgot password — calls same-origin Next.js proxy route.
 */
export async function forgotPassword(request: ForgotPasswordRequest): Promise<{ detail: string }> {
  return browserRequest<{ detail: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: request,
  });
}

/**
 * Reset password — calls same-origin Next.js proxy route.
 */
export async function resetPassword(request: ResetPasswordRequest): Promise<{ detail: string }> {
  return browserRequest<{ detail: string }>("/api/auth/reset-password", {
    method: "POST",
    body: request,
  });
}

/**
 * Fetch current user — calls same-origin Next.js proxy route.
 * Server reads the HTTP-only access cookie and forwards to Django.
 */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await browserRequest<CurrentUserResponse>("/api/auth/me", {
      method: "GET",
    });
    return mapCurrentUserData(response);
  } catch {
    return null;
  }
}
