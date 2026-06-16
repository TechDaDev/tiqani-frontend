/**
 * Tests for unread count polling behavior.
 * Uses fake timers to verify interval, visibility pause/resume, auth failure handling.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// Mock browserRequest before importing the hook
const mockBrowserRequest = vi.fn();
vi.mock("@/lib/api/browser-client", () => ({
  browserRequest: (...args: unknown[]) => mockBrowserRequest(...args),
}));

import { useUnreadCount } from "@/lib/messages/query";

const mockUnreadResponse = (total: number) => ({
  total_unread: total,
  rooms: [],
});

beforeEach(() => {
  vi.useFakeTimers();
  mockBrowserRequest.mockReset();
  // Mock document.visibilityState
  Object.defineProperty(document, "visibilityState", {
    value: "visible",
    configurable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("useUnreadCount", () => {
  it("fetches unread count immediately on startPolling", async () => {
    mockBrowserRequest.mockResolvedValue(mockUnreadResponse(5));

    const { result } = renderHook(() => useUnreadCount());

    await act(async () => {
      result.current.startPolling();
    });

    expect(mockBrowserRequest).toHaveBeenCalledWith("/api/messages/unread-count/");
    expect(result.current.data?.total_unread).toBe(5);
  });

  it("polls at 30s interval", async () => {
    mockBrowserRequest.mockResolvedValue(mockUnreadResponse(3));

    const { result } = renderHook(() => useUnreadCount());

    await act(async () => {
      result.current.startPolling();
    });
    expect(mockBrowserRequest).toHaveBeenCalledTimes(1);

    // Advance 30 seconds — should poll again
    mockBrowserRequest.mockResolvedValue(mockUnreadResponse(5));
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });
    expect(mockBrowserRequest).toHaveBeenCalledTimes(2);
    expect(result.current.data?.total_unread).toBe(5);

    // Advance another 30 seconds
    mockBrowserRequest.mockResolvedValue(mockUnreadResponse(1));
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });
    expect(mockBrowserRequest).toHaveBeenCalledTimes(3);
    expect(result.current.data?.total_unread).toBe(1);
  });

  it("pauses polling when tab is hidden", async () => {
    mockBrowserRequest.mockResolvedValue(mockUnreadResponse(3));
    const { result } = renderHook(() => useUnreadCount());

    await act(async () => {
      result.current.startPolling();
    });
    expect(mockBrowserRequest).toHaveBeenCalledTimes(1);

    // Hide tab
    await act(async () => {
      Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    // Advance 60 seconds — should NOT poll while hidden
    mockBrowserRequest.mockClear();
    await act(async () => {
      vi.advanceTimersByTime(60000);
    });
    expect(mockBrowserRequest).not.toHaveBeenCalled();
  });

  it("resumes polling when tab becomes visible", async () => {
    mockBrowserRequest.mockResolvedValue(mockUnreadResponse(3));
    const { result } = renderHook(() => useUnreadCount());

    await act(async () => {
      result.current.startPolling();
    });
    mockBrowserRequest.mockClear();

    // Hide tab
    await act(async () => {
      Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    // Advance 30 seconds — no calls while hidden
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });
    expect(mockBrowserRequest).not.toHaveBeenCalled();

    // Show tab → should fetch immediately
    mockBrowserRequest.mockResolvedValue(mockUnreadResponse(7));
    await act(async () => {
      Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(mockBrowserRequest).toHaveBeenCalledTimes(1);
    expect(result.current.data?.total_unread).toBe(7);
  });

  it("does not create duplicate intervals after repeated visibility changes", async () => {
    mockBrowserRequest.mockResolvedValue(mockUnreadResponse(0));
    const { result } = renderHook(() => useUnreadCount());

    await act(async () => {
      result.current.startPolling();
    });
    mockBrowserRequest.mockClear();

    // Multiple visibility changes
    for (let i = 0; i < 3; i++) {
      await act(async () => {
        Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await act(async () => {
        Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
        document.dispatchEvent(new Event("visibilitychange"));
      });
    }

    // Three visibility changes → 3 resume fetches
    expect(mockBrowserRequest).toHaveBeenCalledTimes(3);

    // Advance 30 seconds — should fire only one interval (not multiple)
    mockBrowserRequest.mockResolvedValue(mockUnreadResponse(1));
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });
    // 3 resume fetches + 1 interval tick = 4
    expect(mockBrowserRequest).toHaveBeenCalledTimes(4);
  });

  it("cleans up interval on unmount", async () => {
    mockBrowserRequest.mockResolvedValue(mockUnreadResponse(3));
    const { result, unmount } = renderHook(() => useUnreadCount());

    await act(async () => {
      result.current.startPolling();
    });
    mockBrowserRequest.mockClear();

    // Unmount
    await act(() => {
      unmount();
    });

    // Advance 30 seconds — should not poll after unmount
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });
    expect(mockBrowserRequest).not.toHaveBeenCalled();
  });

  it("stops polling on 401", async () => {
    mockBrowserRequest.mockRejectedValue({ status: 401 });
    const { result } = renderHook(() => useUnreadCount());

    await act(async () => {
      result.current.startPolling();
    });

    // Advance 30 seconds — should not retry after 401
    mockBrowserRequest.mockClear();
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });
    expect(mockBrowserRequest).not.toHaveBeenCalled();
  });

  it("stops polling on 403", async () => {
    mockBrowserRequest.mockRejectedValue({ status: 403 });
    const { result } = renderHook(() => useUnreadCount());

    await act(async () => {
      result.current.startPolling();
    });

    mockBrowserRequest.mockClear();
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });
    expect(mockBrowserRequest).not.toHaveBeenCalled();
  });

  it("continues polling on transient 500", async () => {
    // First call succeeds, second fails with 500, third succeeds
    mockBrowserRequest
      .mockResolvedValueOnce(mockUnreadResponse(0))
      .mockRejectedValueOnce({ status: 500 })
      .mockResolvedValueOnce(mockUnreadResponse(2));

    const { result } = renderHook(() => useUnreadCount());

    await act(async () => {
      result.current.startPolling();
    });
    expect(result.current.data?.total_unread).toBe(0);

    // Advance 30s — 500 should not stop polling
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });
    expect(mockBrowserRequest).toHaveBeenCalledTimes(2);

    // Advance 30s — third call should succeed
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });
    expect(mockBrowserRequest).toHaveBeenCalledTimes(3);
    expect(result.current.data?.total_unread).toBe(2);
  });

  it("handles zero unread correctly", async () => {
    mockBrowserRequest.mockResolvedValue(mockUnreadResponse(0));
    const { result } = renderHook(() => useUnreadCount());

    await act(async () => {
      result.current.startPolling();
    });
    expect(result.current.data?.total_unread).toBe(0);
  });

  it("handles unread count above 99", async () => {
    mockBrowserRequest.mockResolvedValue(mockUnreadResponse(150));
    const { result } = renderHook(() => useUnreadCount());

    await act(async () => {
      result.current.startPolling();
    });
    expect(result.current.data?.total_unread).toBe(150);
  });

  it("updates after mark-read", async () => {
    mockBrowserRequest
      .mockResolvedValueOnce(mockUnreadResponse(5))
      .mockResolvedValueOnce(mockUnreadResponse(0));

    const { result } = renderHook(() => useUnreadCount());

    await act(async () => {
      result.current.startPolling();
    });
    expect(result.current.data?.total_unread).toBe(5);

    // Advance 30s — should get updated count
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });
    expect(result.current.data?.total_unread).toBe(0);
  });
});
