/**
 * Tests for service request status helper utilities.
 */
import { describe, it, expect } from "vitest";
import {
  normalizeRequestStatus,
  getRequestStatusLabelKey,
  getRequestStatusTone,
  getAllowedClientActions,
  getAllowedTechnicianActions,
  isTerminalStatus,
} from "@/lib/requests/status";

describe("normalizeRequestStatus", () => {
  it("returns uppercase status", () => {
    expect(normalizeRequestStatus("pending")).toBe("PENDING");
    expect(normalizeRequestStatus("Pending")).toBe("PENDING");
    expect(normalizeRequestStatus("PENDING")).toBe("PENDING");
  });

  it("handles all valid statuses", () => {
    expect(normalizeRequestStatus("accepted")).toBe("ACCEPTED");
    expect(normalizeRequestStatus("declined")).toBe("DECLINED");
    expect(normalizeRequestStatus("cancelled")).toBe("CANCELLED");
    expect(normalizeRequestStatus("withdrawn")).toBe("WITHDRAWN");
  });

  it("returns unknown status as-is uppercased", () => {
    expect(normalizeRequestStatus("unknown_status")).toBe("UNKNOWN_STATUS");
    expect(normalizeRequestStatus("")).toBe("");
  });
});

describe("getRequestStatusLabelKey", () => {
  it("returns correct i18n keys for all statuses", () => {
    expect(getRequestStatusLabelKey("PENDING")).toBe("requestStatus.pending");
    expect(getRequestStatusLabelKey("ACCEPTED")).toBe("requestStatus.accepted");
    expect(getRequestStatusLabelKey("DECLINED")).toBe("requestStatus.declined");
    expect(getRequestStatusLabelKey("CANCELLED")).toBe("requestStatus.cancelled");
    expect(getRequestStatusLabelKey("WITHDRAWN")).toBe("requestStatus.withdrawn");
  });

  it("returns fallback for unknown status", () => {
    expect(getRequestStatusLabelKey("UNKNOWN" as any)).toBe("requestStatus.unknown");
  });
});

describe("getRequestStatusTone", () => {
  it("returns correct tones for all statuses", () => {
    expect(getRequestStatusTone("PENDING")).toBe("warning");
    expect(getRequestStatusTone("ACCEPTED")).toBe("success");
    expect(getRequestStatusTone("DECLINED")).toBe("danger");
    expect(getRequestStatusTone("CANCELLED")).toBe("secondary");
    expect(getRequestStatusTone("WITHDRAWN")).toBe("secondary");
  });

  it("returns default tone for unknown status", () => {
    expect(getRequestStatusTone("UNKNOWN" as any)).toBe("default");
  });
});

describe("getAllowedClientActions", () => {
  it("allows cancel and withdraw for PENDING", () => {
    expect(getAllowedClientActions("PENDING")).toEqual(["cancel", "withdraw"]);
  });

  it("returns empty for ACCEPTED", () => {
    expect(getAllowedClientActions("ACCEPTED")).toEqual([]);
  });

  it("returns empty for DECLINED", () => {
    expect(getAllowedClientActions("DECLINED")).toEqual([]);
  });

  it("returns empty for CANCELLED", () => {
    expect(getAllowedClientActions("CANCELLED")).toEqual([]);
  });

  it("returns empty for WITHDRAWN", () => {
    expect(getAllowedClientActions("WITHDRAWN")).toEqual([]);
  });
});

describe("getAllowedTechnicianActions", () => {
  it("allows accept and decline for PENDING", () => {
    expect(getAllowedTechnicianActions("PENDING")).toEqual(["accept", "decline"]);
  });

  it("returns empty for ACCEPTED", () => {
    expect(getAllowedTechnicianActions("ACCEPTED")).toEqual([]);
  });

  it("returns empty for DECLINED", () => {
    expect(getAllowedTechnicianActions("DECLINED")).toEqual([]);
  });

  it("returns empty for CANCELLED", () => {
    expect(getAllowedTechnicianActions("CANCELLED")).toEqual([]);
  });

  it("returns empty for WITHDRAWN", () => {
    expect(getAllowedTechnicianActions("WITHDRAWN")).toEqual([]);
  });
});

describe("isTerminalStatus", () => {
  it("returns false for PENDING", () => {
    expect(isTerminalStatus("PENDING")).toBe(false);
  });

  it("returns true for ACCEPTED", () => {
    expect(isTerminalStatus("ACCEPTED")).toBe(true);
  });

  it("returns true for DECLINED", () => {
    expect(isTerminalStatus("DECLINED")).toBe(true);
  });

  it("returns true for CANCELLED", () => {
    expect(isTerminalStatus("CANCELLED")).toBe(true);
  });

  it("returns true for WITHDRAWN", () => {
    expect(isTerminalStatus("WITHDRAWN")).toBe(true);
  });
});
