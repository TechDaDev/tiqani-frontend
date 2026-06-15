"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { AuthUser, AuthStatus } from "@/lib/auth/types";
import * as authService from "@/lib/auth/service";
import { setAccessToken } from "@/lib/api/client";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<AuthUser>;
  register: (data: Parameters<typeof authService.register>[0]) => Promise<{ detail: string; email: string }>;
  verifyOtp: (email: string, otpCode: string) => Promise<void>;
  resendOtp: (email: string) => Promise<{ resends_remaining: number }>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otpCode: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_REFRESH_KEY = "tiqani_refresh";

function getStoredRefresh(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_REFRESH_KEY);
  } catch {
    return null;
  }
}

function setStoredRefresh(token: string | null) {
  try {
    if (token) {
      sessionStorage.setItem(STORAGE_REFRESH_KEY, token);
    } else {
      sessionStorage.removeItem(STORAGE_REFRESH_KEY);
    }
  } catch {
    // sessionStorage unavailable
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);

  const clearSession = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshTokenValue(null);
    setStoredRefresh(null);
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const stored = getStoredRefresh();
    const token = stored || refreshTokenValue;
    if (!token) {
      setStatus("unauthenticated");
      return false;
    }
    try {
      const { access } = await authService.refreshToken(token);
      setAccessToken(access);
      const currentUser = await authService.fetchCurrentUser();
      setUser(currentUser);
      setStatus(currentUser.isActive ? "authenticated" : "blocked");
      return true;
    } catch {
      clearSession();
      setStatus("unauthenticated");
      return false;
    }
  }, [refreshTokenValue, clearSession]);

  // Restore session on mount
  useEffect(() => {
    const stored = getStoredRefresh();
    if (stored) {
      setRefreshTokenValue(stored);
      refreshSession();
    } else {
      setStatus("unauthenticated");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (username: string, password: string): Promise<AuthUser> => {
    const result = await authService.login({ username, password });
    setAccessToken(result.access);
    setRefreshTokenValue(result.refresh);
    setStoredRefresh(result.refresh);
    setUser(result.user);
    setStatus("authenticated");
    return result.user;
  }, []);

  const registerFn = useCallback(async (data: Parameters<typeof authService.register>[0]) => {
    return authService.register(data);
  }, []);

  const verifyOtp = useCallback(async (email: string, otpCode: string) => {
    await authService.verifyEmail({ email, otp_code: otpCode });
  }, []);

  const resendOtp = useCallback(async (email: string) => {
    const response = await authService.resendOtp({ email });
    return { resends_remaining: response.resends_remaining };
  }, []);

  const forgotPasswordFn = useCallback(async (email: string) => {
    await authService.forgotPassword({ email });
  }, []);

  const resetPasswordFn = useCallback(async (email: string, otpCode: string, newPassword: string) => {
    await authService.resetPassword({ email, otp_code: otpCode, new_password: newPassword });
  }, []);

  const logout = useCallback(async () => {
    const stored = getStoredRefresh();
    const token = stored || refreshTokenValue;
    if (token) {
      await authService.logout(token);
    }
    clearSession();
    setStatus("unauthenticated");
  }, [refreshTokenValue, clearSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        login,
        register: registerFn,
        verifyOtp,
        resendOtp,
        forgotPassword: forgotPasswordFn,
        resetPassword: resetPasswordFn,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
