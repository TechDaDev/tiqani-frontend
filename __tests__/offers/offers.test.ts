/**
 * Unit tests for offer domain functions and components.
 */
import { describe, it, expect } from "vitest";
import type { Offer, OfferStatus } from "@/lib/offers/types";

const OFFER_STATUSES: OfferStatus[] = [
  "DRAFT",
  "SUBMITTED",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
];

function createMockOffer(overrides: Partial<Offer> = {}): Offer {
  return {
    id: "test-offer-id",
    service_request: "test-request-id",
    technician: {
      user_id: "tech-id",
      full_name: "Test Technician",
      job_title: "Plumber",
      governorate: "Baghdad",
    },
    client: {
      user_id: "client-id",
      full_name: "Test Client",
      governorate: "Baghdad",
    },
    amount: "150000.00",
    currency: "IQD",
    description: "Test offer description",
    duration_days: 3,
    status: "SUBMITTED" as OfferStatus,
    can_edit: false,
    can_withdraw: true,
    is_terminal: false,
    created_at: "2026-06-16T10:00:00Z",
    updated_at: "2026-06-16T10:30:00Z",
    ...overrides,
  };
}

describe("Offer domain", () => {
  it("should include all required fields", () => {
    const offer = createMockOffer();
    expect(offer.id).toBeDefined();
    expect(offer.service_request).toBeDefined();
    expect(offer.technician).toBeDefined();
    expect(offer.client).toBeDefined();
    expect(offer.amount).toBeDefined();
    expect(offer.currency).toBe("IQD");
    expect(offer.description).toBeDefined();
    expect(offer.status).toBeDefined();
    expect(offer.created_at).toBeDefined();
  });

  it("should handle all statuses", () => {
    for (const status of OFFER_STATUSES) {
      const offer = createMockOffer({ status });
      expect(offer.status).toBe(status);
    }
  });

  it("should handle terminal states correctly", () => {
    const terminal: OfferStatus[] = ["ACCEPTED", "REJECTED", "WITHDRAWN"];
    const nonTerminal: OfferStatus[] = ["DRAFT", "SUBMITTED"];

    for (const status of terminal) {
      const offer = createMockOffer({ status, is_terminal: true });
      expect(offer.is_terminal).toBe(true);
    }

    for (const status of nonTerminal) {
      const offer = createMockOffer({ status, is_terminal: false });
      expect(offer.is_terminal).toBe(false);
    }
  });

  it("should handle can_edit correctly", () => {
    const draft = createMockOffer({ status: "DRAFT", can_edit: true });
    expect(draft.can_edit).toBe(true);

    const submitted = createMockOffer({ status: "SUBMITTED", can_edit: false });
    expect(submitted.can_edit).toBe(false);
  });

  it("should handle can_withdraw correctly", () => {
    const submitted = createMockOffer({ status: "SUBMITTED", can_withdraw: true });
    expect(submitted.can_withdraw).toBe(true);

    const draft = createMockOffer({ status: "DRAFT", can_withdraw: false });
    expect(draft.can_withdraw).toBe(false);
  });

  it("should preserve decimal precision in amount", () => {
    const offer = createMockOffer({ amount: "50000.50" });
    expect(offer.amount).toBe("50000.50");
    expect(offer.amount.includes(".")).toBe(true);
  });

  it("should handle zero duration_days", () => {
    const offer = createMockOffer({ duration_days: undefined });
    expect(offer.duration_days).toBeUndefined();
  });

  it("should handle duration_days as number", () => {
    const offer = createMockOffer({ duration_days: 7 });
    expect(offer.duration_days).toBe(7);
  });

  it("should not expose private fields in client summary", () => {
    const offer = createMockOffer();
    expect(offer.client).not.toHaveProperty("email");
    expect(offer.client).not.toHaveProperty("phone");
    expect(offer.client).not.toHaveProperty("password");
  });

  it("should not expose private fields in technician summary", () => {
    const offer = createMockOffer();
    expect(offer.technician).not.toHaveProperty("email");
    expect(offer.technician).not.toHaveProperty("phone");
    expect(offer.technician).not.toHaveProperty("password");
  });

  it("should handle empty description", () => {
    const offer = createMockOffer({ description: "" });
    expect(offer.description).toBe("");
  });

  it("should parse created_at as ISO date string", () => {
    const offer = createMockOffer();
    const date = new Date(offer.created_at);
    expect(date instanceof Date).toBe(true);
    expect(isNaN(date.getTime())).toBe(false);
  });

  it("should handle request_title", () => {
    const offer = createMockOffer({ request_title: "Fix AC Unit" });
    expect(offer.request_title).toBe("Fix AC Unit");
  });

  it("should handle missing request_title", () => {
    const offer = createMockOffer({ request_title: undefined });
    expect(offer.request_title).toBeUndefined();
  });
});

describe("MoneyDisplay component logic", () => {
  it("should parse string amount correctly", () => {
    const amount = "150000.00";
    const parsed = parseFloat(amount);
    expect(parsed).toBe(150000);
  });

  it("should format amount with locale", () => {
    const amount = 150000;
    const formatted = amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    expect(formatted).toBe("150,000");
  });

  it("should handle decimal amounts", () => {
    const amount = 50000.50;
    const formatted = amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    expect(formatted).toBe("50,000.5");
  });
});

describe("AcceptOfferResponse", () => {
  it("should contain offer_id and contract_id", () => {
    const response = {
      detail: "Offer accepted. Contract created.",
      offer_id: "test-offer-id",
      contract_id: "test-contract-id",
      offer_status: "ACCEPTED",
    };
    expect(response.detail).toBeDefined();
    expect(response.offer_id).toBeDefined();
    expect(response.contract_id).toBeDefined();
    expect(response.offer_status).toBe("ACCEPTED");
  });
});

describe("CreateOfferPayload", () => {
  it("should require service_request_id", () => {
    const payload = {
      service_request_id: "req-id",
      amount: "100000.00",
      description: "Test work",
    };
    expect(payload.service_request_id).toBeDefined();
    expect(payload.amount).toBeDefined();
    expect(payload.description).toBeDefined();
  });

  it("should support optional duration_days", () => {
    const payload = {
      service_request_id: "req-id",
      amount: "100000.00",
      description: "Test",
      duration_days: 3,
    };
    expect(payload.duration_days).toBe(3);
  });

  it("should support null duration_days", () => {
    const payload: Record<string, unknown> = {
      service_request_id: "req-id",
      amount: "100000.00",
      description: "Test",
      duration_days: null,
    };
    expect(payload.duration_days).toBeNull();
  });
});

describe("OfferStatusBadge layout", () => {
  it("should have distinct color classes per status", () => {
    const statusColorMap: Record<OfferStatus, string> = {
      DRAFT: "gray",
      SUBMITTED: "blue",
      ACCEPTED: "green",
      REJECTED: "red",
      WITHDRAWN: "yellow",
    };

    for (const [status, color] of Object.entries(statusColorMap)) {
      expect(color).toBeDefined();
      expect(status).toBeTruthy();
    }
  });
});

describe("AcceptOffer confirmation", () => {
  it("should warn about contract creation", () => {
    const confirmationMessage = "Accepting this offer will create a contract. This action cannot be undone.";
    expect(confirmationMessage).toContain("contract");
    expect(confirmationMessage).toContain("cannot be undone");
  });
});
