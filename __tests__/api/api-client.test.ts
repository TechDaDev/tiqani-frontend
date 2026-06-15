import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiRequest, setAccessToken } from "@/lib/api/client";
import { ApiClientError } from "@/lib/api/errors";

const BASE = "http://127.0.0.1:8000";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  setAccessToken(null);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiRequest", () => {
  it("sends JSON POST request", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: "1" }),
    } as Response);

    const result = await apiRequest("/api/auth/login/", {
      method: "POST",
      body: { username: "test", password: "pass" },
    });

    expect(fetch).toHaveBeenCalledWith(
      `${BASE}/api/auth/login/`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ username: "test", password: "pass" }),
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
      })
    );
    expect(result).toEqual({ id: "1" });
  });

  it("includes Bearer token when set", async () => {
    setAccessToken("test-token");
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    } as Response);

    await apiRequest("/api/test/");

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer test-token" }),
      })
    );
  });

  it("throws ApiClientError on 401", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ detail: "Invalid credentials" }),
    } as Response);

    const error = (await apiRequest("/api/auth/login/").catch((e) => e)) as ApiClientError;
    expect(error).toBeInstanceOf(ApiClientError);
    expect(error.message).toBe("Invalid credentials");
    expect(error.status).toBe(401);
  });

  it("throws ApiClientError on 429 with detail", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: () => Promise.resolve({ detail: "Too many attempts" }),
    } as Response);

    await expect(apiRequest("/api/auth/login/")).rejects.toMatchObject({
      status: 429,
    });
  });

  it("throws ApiClientError with field errors on 400", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ email: ["This field is required."] }),
    } as Response);

    try {
      await apiRequest("/api/auth/register/");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiClientError);
      expect((err as ApiClientError).fieldErrors).toEqual({
        email: ["This field is required."],
      });
    }
  });

  it("throws ApiClientError on network failure", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(apiRequest("/api/test/")).rejects.toThrow("Network error");
  });

  it("handles 205 no content", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 205,
    } as Response);

    const result = await apiRequest("/api/auth/logout/", { method: "POST" });
    expect(result).toBeUndefined();
  });

  it("applies timeout", async () => {
    vi.mocked(fetch).mockImplementationOnce(
      () => new Promise((_, reject) => {
        setTimeout(() => reject(new DOMException("Aborted", "AbortError")), 100);
      })
    );

    await expect(apiRequest("/api/test/", { timeout: 10 })).rejects.toThrow("Request timed out");
  });
});
