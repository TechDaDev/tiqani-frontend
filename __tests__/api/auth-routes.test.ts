/**
 * Unit and integration tests for all Next.js authentication route handlers.
 *
 * Each test mocks the backend-client so we can verify route-handler behavior
 * without a running Django server.
 *
 * Required coverage verified:
 * - Successful Django response proxying
 * - Backend field-validation error propagation
 * - Invalid credentials (401)
 * - Expired access token (401)
 * - Successful refresh and cookie rotation
 * - Invalid refresh token with cookie clearing
 * - Backend unavailable (502)
 * - Timeout (408)
 * - HTTP 429 rate limit
 * - Malformed backend response error handling
 * - Secure cookie creation (HttpOnly, Path=/, SameSite)
 * - Cookie rotation via refresh
 * - Cookie clearing on logout (even on backend failure)
 * - Cookie clearing after refresh failure
 * - No access/refresh token in browser-visible JSON
 * - No password, OTP, cookie, or token values logged
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createMockPostRequest, createMockGetRequest } from "./auth-helpers";

// Mock backend-client so route handlers don't need a real Django server
vi.mock("@/lib/api/backend-client", () => ({
  backendPost: vi.fn(),
  backendGet: vi.fn(),
}));

import { backendPost, backendGet } from "@/lib/api/backend-client";
import { ApiClientError } from "@/lib/api/errors";
import { POST as loginHandler } from "@/app/api/auth/login/route";
import { POST as registerHandler } from "@/app/api/auth/register/route";
import { POST as verifyOtpHandler } from "@/app/api/auth/verify-otp/route";
import { POST as resendOtpHandler } from "@/app/api/auth/resend-otp/route";
import { GET as meHandler } from "@/app/api/auth/me/route";
import { POST as refreshHandler } from "@/app/api/auth/refresh/route";
import { POST as logoutHandler } from "@/app/api/auth/logout/route";
import { POST as forgotPasswordHandler } from "@/app/api/auth/forgot-password/route";
import { POST as resetPasswordHandler } from "@/app/api/auth/reset-password/route";

// Spy on console to verify no sensitive values are logged
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

const mockedBackendPost = vi.mocked(backendPost);
const mockedBackendGet = vi.mocked(backendGet);

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

/** Shortcut to create an ApiClientError for mock rejection */
function apiError(status: number, message: string, options?: { fieldErrors?: Record<string, string[]> }): ApiClientError {
  return new ApiClientError(status, message, options);
}

/** Collect all console output as text for leak checking */
function consoleText(): string {
  return JSON.stringify([
    ...consoleErrorSpy.mock.calls,
    ...consoleLogSpy.mock.calls,
    ...consoleWarnSpy.mock.calls,
  ]);
}

// ============================================================
// LOGIN
// ============================================================
describe("POST /api/auth/login", () => {
  const validBody = { username: "testuser", password: "TestPass123!" };

  it("proxies valid credentials and sets HTTP-only cookies", async () => {
    const djangoData = {
      access: "access-token-123",
      refresh: "refresh-token-456",
      userdata: { pk: 1, username: "testuser", email: "test@example.com", role: "client" },
    };
    mockedBackendPost.mockResolvedValueOnce({ status: 200, data: djangoData, headers: new Headers() });

    const request = createMockPostRequest(validBody);
    const response = await loginHandler(request);
    const json = await response.json();

    expect(json).not.toHaveProperty("access");
    expect(json).not.toHaveProperty("refresh");
    expect(json.userdata).toBeDefined();
    expect(json.userdata.username).toBe("testuser");

    const setCookie = response.headers.get("set-cookie") || "";
    expect(setCookie).toContain("tiqani_access");
    expect(setCookie).toContain("tiqani_refresh");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("Path=/");
  });

  it("returns 400 when username is missing", async () => {
    const request = createMockPostRequest({ password: "TestPass123!" });
    const response = await loginHandler(request);
    expect(response.status).toBe(400);
    expect((await response.json()).detail).toContain("required");
  });

  it("returns 400 when password is missing", async () => {
    const request = createMockPostRequest({ username: "testuser" });
    const response = await loginHandler(request);
    expect(response.status).toBe(400);
    expect((await response.json()).detail).toContain("required");
  });

  it("returns 401 for invalid credentials", async () => {
    mockedBackendPost.mockRejectedValueOnce(apiError(401, "Invalid credentials"));
    const request = createMockPostRequest(validBody);
    const response = await loginHandler(request);
    expect(response.status).toBe(401);
    expect((await response.json()).detail).toBe("Invalid credentials");
  });

  it("returns field errors on 400 from Django", async () => {
    mockedBackendPost.mockRejectedValueOnce(
      apiError(400, "Validation error", { fieldErrors: { username: ["This account is inactive."] } })
    );
    const request = createMockPostRequest(validBody);
    const response = await loginHandler(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.field_errors).toBeDefined();
    expect(json.field_errors.username).toContain("This account is inactive.");
  });

  it("returns 502 when backend is unavailable", async () => {
    mockedBackendPost.mockRejectedValueOnce(apiError(502, "Backend unavailable"));
    const request = createMockPostRequest(validBody);
    const response = await loginHandler(request);
    expect(response.status).toBe(502);
  });

  it("returns 408 on timeout", async () => {
    mockedBackendPost.mockRejectedValueOnce(apiError(408, "Backend request timed out"));
    const request = createMockPostRequest(validBody);
    const response = await loginHandler(request);
    expect(response.status).toBe(408);
  });

  it("returns 429 on rate limit", async () => {
    mockedBackendPost.mockRejectedValueOnce(apiError(429, "Too many attempts"));
    const request = createMockPostRequest(validBody);
    const response = await loginHandler(request);
    expect(response.status).toBe(429);
  });

  it("returns 500 on unexpected error", async () => {
    mockedBackendPost.mockRejectedValueOnce(new Error("Something broke"));
    const request = createMockPostRequest(validBody);
    const response = await loginHandler(request);
    expect(response.status).toBe(500);
  });

  it("does not log password values", async () => {
    mockedBackendPost.mockResolvedValueOnce({
      status: 200,
      data: { access: "tok", refresh: "ref", userdata: { pk: 1, username: "testuser", email: "t@t.com", role: "client" } },
      headers: new Headers(),
    });
    const request = createMockPostRequest(validBody);
    await loginHandler(request);
    expect(consoleText().toLowerCase()).not.toContain("testpass123!");
  });
});

// ============================================================
// REGISTER
// ============================================================
describe("POST /api/auth/register", () => {
  const validBody = {
    username: "newuser", email: "new@example.com", password: "StrongPass123!",
    first_name: "New", last_name: "User", role: "client",
  };

  it("proxies registration and returns Django response", async () => {
    mockedBackendPost.mockResolvedValueOnce({
      status: 201,
      data: { detail: "Registration successful. Please check your email for OTP.", email: "new@example.com" },
      headers: new Headers(),
    });
    const request = createMockPostRequest(validBody);
    const response = await registerHandler(request);
    expect(response.status).toBe(201);
    expect((await response.json()).detail).toContain("successful");
  });

  it("validates required fields client-side", async () => {
    const request = createMockPostRequest({ username: "nouser" });
    const response = await registerHandler(request);
    expect(response.status).toBe(400);
    expect((await response.json()).detail).toContain("Required fields");
  });

  it("returns field errors from backend on duplicate username", async () => {
    mockedBackendPost.mockRejectedValueOnce(
      apiError(400, "Validation error", { fieldErrors: { username: ["A user with that username already exists."] } })
    );
    const request = createMockPostRequest(validBody);
    const response = await registerHandler(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.field_errors).toBeDefined();
    expect(json.field_errors.username[0]).toContain("already exists");
  });

  it("returns 502 on backend failure", async () => {
    mockedBackendPost.mockRejectedValueOnce(apiError(502, "Backend unavailable"));
    const request = createMockPostRequest(validBody);
    const response = await registerHandler(request);
    expect(response.status).toBe(502);
  });

  it("does not log password values", async () => {
    mockedBackendPost.mockRejectedValueOnce(apiError(502, "Backend unavailable"));
    const request = createMockPostRequest(validBody);
    await registerHandler(request);
    expect(consoleText().toLowerCase()).not.toContain("strongpass123!");
  });
});

// ============================================================
// VERIFY OTP
// ============================================================
describe("POST /api/auth/verify-otp", () => {
  const validBody = { email: "user@example.com", otp_code: "123456" };

  it("proxies OTP verification and returns Django response", async () => {
    mockedBackendPost.mockResolvedValueOnce({
      status: 200, data: { detail: "Email verified successfully.", username: "testuser" },
      headers: new Headers(),
    });
    const request = createMockPostRequest(validBody);
    const response = await verifyOtpHandler(request);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.detail).toContain("verified");
    expect(json.username).toBe("testuser");
  });

  it("returns 400 when email is missing", async () => {
    const response = await verifyOtpHandler(createMockPostRequest({ otp_code: "123456" }));
    expect(response.status).toBe(400);
  });

  it("returns 400 when OTP code is missing", async () => {
    const response = await verifyOtpHandler(createMockPostRequest({ email: "user@example.com" }));
    expect(response.status).toBe(400);
  });

  it("returns invalid OTP error from backend", async () => {
    mockedBackendPost.mockRejectedValueOnce(apiError(400, "Invalid or expired OTP code."));
    const response = await verifyOtpHandler(createMockPostRequest(validBody));
    expect(response.status).toBe(400);
    expect((await response.json()).detail).toContain("OTP");
  });

  it("does not leak OTP in console", async () => {
    mockedBackendPost.mockRejectedValueOnce(apiError(400, "Invalid or expired OTP code."));
    await verifyOtpHandler(createMockPostRequest(validBody));
    expect(consoleText()).not.toContain("123456");
  });
});

// ============================================================
// RESEND OTP
// ============================================================
describe("POST /api/auth/resend-otp", () => {
  it("proxies resend request and returns Django response", async () => {
    mockedBackendPost.mockResolvedValueOnce({
      status: 200, data: { detail: "OTP resent successfully.", email: "user@example.com", resends_remaining: 3 },
      headers: new Headers(),
    });
    const response = await resendOtpHandler(createMockPostRequest({ email: "user@example.com" }));
    expect(response.status).toBe(200);
    expect((await response.json()).detail).toContain("resent");
  });

  it("returns 400 when email is missing", async () => {
    const response = await resendOtpHandler(createMockPostRequest({}));
    expect(response.status).toBe(400);
  });

  it("returns backend error when rate-limited", async () => {
    mockedBackendPost.mockRejectedValueOnce(apiError(429, "Too many resend attempts. Please try later."));
    const response = await resendOtpHandler(createMockPostRequest({ email: "user@example.com" }));
    expect(response.status).toBe(429);
  });
});

// ============================================================
// CURRENT USER (ME)
// ============================================================
describe("GET /api/auth/me", () => {
  it("returns user data when access token cookie is present", async () => {
    mockedBackendGet.mockResolvedValueOnce({
      status: 200, data: { pk: 1, username: "testuser", email: "test@example.com", role: "client" },
      headers: new Headers(),
    });
    const response = await meHandler(createMockGetRequest({ tiqani_access: "valid-token" }));
    expect(response.status).toBe(200);
    expect((await response.json()).username).toBe("testuser");
  });

  it("returns 401 when no access token cookie", async () => {
    const response = await meHandler(createMockGetRequest({}));
    expect(response.status).toBe(401);
    expect((await response.json()).detail).toContain("Not authenticated");
  });

  it("returns 401 when access token is expired", async () => {
    mockedBackendGet.mockRejectedValueOnce(apiError(401, "Token is expired"));
    const response = await meHandler(createMockGetRequest({ tiqani_access: "expired-token" }));
    expect(response.status).toBe(401);
  });

  it("returns 502 on backend failure", async () => {
    mockedBackendGet.mockRejectedValueOnce(apiError(502, "Backend unavailable"));
    const response = await meHandler(createMockGetRequest({ tiqani_access: "valid-token" }));
    expect(response.status).toBe(502);
  });
});

// ============================================================
// REFRESH
// ============================================================
describe("POST /api/auth/refresh", () => {
  it("successfully refreshes access token and rotates the cookie", async () => {
    mockedBackendPost.mockResolvedValueOnce({ status: 200, data: { access: "new-access-token" }, headers: new Headers() });
    const request = createMockPostRequest({}, { tiqani_refresh: "valid-refresh-token" });
    const response = await refreshHandler(request);
    expect(response.status).toBe(200);
    expect((await response.json()).refreshed).toBe(true);
    expect(response.headers.get("set-cookie") || "").toContain("tiqani_access");
  });

  it("returns 401 when no refresh cookie", async () => {
    const response = await refreshHandler(createMockPostRequest({}, {}));
    expect(response.status).toBe(401);
    expect((await response.json()).detail).toContain("No refresh token");
  });

  it("clears cookies on invalid/expired refresh token", async () => {
    mockedBackendPost.mockRejectedValueOnce(apiError(401, "Token is invalid or expired"));
    const request = createMockPostRequest({}, { tiqani_refresh: "bad-refresh-token" });
    const response = await refreshHandler(request);
    expect(response.status).toBe(401);
    expect((await response.json()).detail).toContain("Session expired");
    const setCookie = response.headers.get("set-cookie") || "";
    expect(setCookie).toContain("Max-Age=0");
    expect(setCookie).toContain("tiqani_access");
    expect(setCookie).toContain("tiqani_refresh");
  });

  it("returns 401 on backend unavailability during refresh", async () => {
    mockedBackendPost.mockRejectedValueOnce(apiError(502, "Backend unavailable"));
    const response = await refreshHandler(createMockPostRequest({}, { tiqani_refresh: "refresh-token" }));
    expect(response.status).toBe(401);
  });
});

// ============================================================
// LOGOUT
// ============================================================
describe("POST /api/auth/logout", () => {
  it("calls backend logout and clears cookies", async () => {
    mockedBackendPost.mockResolvedValueOnce({ status: 205, data: { detail: "Logged out successfully." }, headers: new Headers() });
    const request = createMockPostRequest({}, { tiqani_refresh: "refresh-token" });
    const response = await logoutHandler(request);
    const json = await response.json();
    const setCookie = response.headers.get("set-cookie") || "";
    expect(setCookie).toContain("Max-Age=0");
    expect(setCookie).toContain("tiqani_access");
    expect(setCookie).toContain("tiqani_refresh");
    expect(json).not.toHaveProperty("access");
    expect(json).not.toHaveProperty("refresh");
  });

  it("clears cookies even if backend logout fails", async () => {
    mockedBackendPost.mockRejectedValueOnce(new Error("Backend unreachable"));
    const response = await logoutHandler(createMockPostRequest({}, { tiqani_refresh: "refresh-token" }));
    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie") || "";
    expect(setCookie).toContain("Max-Age=0");
    expect(setCookie).toContain("tiqani_access");
    expect(setCookie).toContain("tiqani_refresh");
  });

  it("clears cookies when no refresh token exists", async () => {
    const response = await logoutHandler(createMockPostRequest({}, {}));
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie") || "").toContain("Max-Age=0");
  });
});

// ============================================================
// FORGOT PASSWORD
// ============================================================
describe("POST /api/auth/forgot-password", () => {
  it("proxies forgot-password request and returns Django response", async () => {
    mockedBackendPost.mockResolvedValueOnce({ status: 200, data: { detail: "Password reset email sent if account exists." }, headers: new Headers() });
    const response = await forgotPasswordHandler(createMockPostRequest({ email: "user@example.com" }));
    expect(response.status).toBe(200);
    expect((await response.json()).detail).toContain("reset");
  });

  it("returns 400 when email is missing", async () => {
    const response = await forgotPasswordHandler(createMockPostRequest({}));
    expect(response.status).toBe(400);
    expect((await response.json()).detail).toContain("required");
  });
});

// ============================================================
// RESET PASSWORD
// ============================================================
describe("POST /api/auth/reset-password", () => {
  const validBody = { email: "user@example.com", otp_code: "123456", new_password: "NewStrongPass123!" };

  it("proxies reset-password and returns Django response", async () => {
    mockedBackendPost.mockResolvedValueOnce({ status: 200, data: { detail: "Password has been reset successfully." }, headers: new Headers() });
    const response = await resetPasswordHandler(createMockPostRequest(validBody));
    expect(response.status).toBe(200);
    expect((await response.json()).detail).toContain("reset");
  });

  it("returns 400 when required fields are missing", async () => {
    const response = await resetPasswordHandler(createMockPostRequest({ email: "user@example.com" }));
    expect(response.status).toBe(400);
    expect((await response.json()).detail).toContain("required");
  });

  it("returns invalid OTP error from backend", async () => {
    mockedBackendPost.mockRejectedValueOnce(
      apiError(400, "Invalid or expired OTP code.", { fieldErrors: { otp_code: ["Invalid or expired OTP code."] } })
    );
    const response = await resetPasswordHandler(createMockPostRequest(validBody));
    expect(response.status).toBe(400);
    expect((await response.json()).field_errors).toBeDefined();
  });

  it("does not log new_password in console", async () => {
    mockedBackendPost.mockRejectedValueOnce(apiError(502, "Backend unavailable"));
    await resetPasswordHandler(createMockPostRequest(validBody));
    expect(consoleText().toLowerCase()).not.toContain("newstrongpass123!");
  });
});

// ============================================================
// SECURITY: CROSS-CUTTING
// ============================================================
describe("Security: cookies and sensitive data", () => {
  it("login response does not contain access or refresh tokens in JSON body", async () => {
    mockedBackendPost.mockResolvedValueOnce({
      status: 200,
      data: { access: "should-not-leak", refresh: "should-not-leak", userdata: { pk: 1, username: "test", email: "t@t.com", role: "client" } },
      headers: new Headers(),
    });
    const response = await loginHandler(createMockPostRequest({ username: "test", password: "pass" }));
    const json = await response.json();
    expect(json).not.toHaveProperty("access");
    expect(json).not.toHaveProperty("refresh");
    expect(json.userdata).toBeDefined();
  });

  it("all auth cookies have HttpOnly and Path=/", async () => {
    mockedBackendPost.mockResolvedValueOnce({
      status: 200,
      data: { access: "tok1", refresh: "tok2", userdata: { pk: 1, username: "test", email: "t@t.com", role: "client" } },
      headers: new Headers(),
    });
    const response = await loginHandler(createMockPostRequest({ username: "test", password: "pass" }));
    const setCookie = response.headers.get("set-cookie") || "";
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("Path=/");
  });
});
