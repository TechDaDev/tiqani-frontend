"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { AuthUser, AuthStatus } from "@/lib/auth/types";
import * as authService from "@/lib/auth/service";
import { COOKIE_NAMES } from "@/lib/auth/cookies";

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

function hasSessionMarker() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith(`${COOKIE_NAMES.SESSION}=`));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const clearSession = useCallback(() => {
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (!hasSessionMarker()) {
      clearSession();
      return false;
    }

    try {
      // Try refreshing the access token using the HTTP-only refresh cookie
      const refreshed = await authService.refreshToken();
      if (!refreshed) {
        clearSession();
        return false;
      }
      const currentUser = await authService.fetchCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setStatus(currentUser.isActive ? "authenticated" : "blocked");
        return true;
      }
      clearSession();
      return false;
    } catch {
      clearSession();
      return false;
    }
  }, [clearSession]);

  // Restore session on mount — server checks HTTP-only cookies
  useEffect(() => {
    const init = async () => {
      if (!hasSessionMarker()) {
        setStatus("unauthenticated");
        return;
      }

      const currentUser = await authService.fetchCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setStatus(currentUser.isActive ? "authenticated" : "blocked");
      } else {
        // Try refresh (may have valid refresh cookie)
        const refreshed = await authService.refreshToken();
        if (refreshed) {
          const user = await authService.fetchCurrentUser();
          if (user) {
            setUser(user);
            setStatus(user.isActive ? "authenticated" : "blocked");
            return;
          }
        }
        setStatus("unauthenticated");
      }
    };
    init();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<AuthUser> => {
    const result = await authService.login({ username, password });
    setUser(result);
    setStatus("authenticated");
    return result;
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
    await authService.logoutFn();
    clearSession();
  }, [clearSession]);

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
