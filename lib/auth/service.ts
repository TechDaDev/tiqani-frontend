import { apiPost, apiGet, setAccessToken } from "@/lib/api/client";
import type {
  LoginRequest,
  LoginResponse,
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
import { mapUserData } from "./types";

const AUTH_PREFIX = "/api/auth";
const ACCOUNTS_PREFIX = "/api/accounts";

export async function login(request: LoginRequest): Promise<{ access: string; refresh: string; user: AuthUser }> {
  const response = await apiPost<LoginResponse>(`${AUTH_PREFIX}/login/`, request);
  setAccessToken(response.access);
  return {
    access: response.access,
    refresh: response.refresh,
    user: mapUserData(response.userdata),
  };
}

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
  // Use JSON, not multipart (file uploads not needed for basic registration)
  return apiPost<RegisterResponse>(`${AUTH_PREFIX}/register/`, request);
}

export async function verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
  return apiPost<VerifyEmailResponse>(`${AUTH_PREFIX}/verify-email/`, request);
}

export async function resendOtp(request: ResendOtpRequest): Promise<ResendOtpResponse> {
  return apiPost<ResendOtpResponse>(`${AUTH_PREFIX}/resend-otp/`, request);
}

export async function refreshToken(refresh: string): Promise<{ access: string }> {
  const response = await apiPost<{ access: string }>(`${AUTH_PREFIX}/refresh/`, { refresh });
  setAccessToken(response.access);
  return response;
}

export async function logout(refresh: string): Promise<void> {
  try {
    await apiPost<void>(`${AUTH_PREFIX}/logout/`, { refresh });
  } catch {
    // Logout is best-effort — clear local state regardless
  }
  setAccessToken(null);
}

export async function forgotPassword(request: ForgotPasswordRequest): Promise<{ detail: string }> {
  return apiPost<{ detail: string }>(`${AUTH_PREFIX}/password-reset/`, request);
}

export async function resetPassword(request: ResetPasswordRequest): Promise<{ detail: string; username?: string }> {
  return apiPost<{ detail: string; username?: string }>(`${AUTH_PREFIX}/password-reset-confirm/`, request);
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await apiGet<CurrentUserResponse>(`${ACCOUNTS_PREFIX}/me/`);
  return mapUserData(response);
}
