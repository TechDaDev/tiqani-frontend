/**
 * Phase 10 fixture identifiers — must match backend seed_e2e_fixtures.py deterministically.
 *
 * Contract UUIDs:  uuid5(NAMESPACE_DNS, "e2e-p10-{label}.tiqani.local")
 * Dispute UUIDs:   uuid5(NAMESPACE_DNS, "e2e-dispute-{label}.tiqani.local")
 * Evidence UUIDs:  uuid5(NAMESPACE_DNS, "e2e-evidence-{label}.tiqani.local")
 *
 * Each mutating test uses its OWN contract so tests never pollute each other.
 */
export const FIXTURE = {
  // ── Credentials ──
  PASSWORD: "local-test-only",

  USER: {
    CLIENT: { email: "e2e-client@tiqani.local", password: "local-test-only", role: "client" as const },
    TECHNICIAN: { email: "e2e-technician@tiqani.local", password: "local-test-only", role: "technician" as const },
    APPROVED_TECH: { email: "e2e-approved-tech@tiqani.local", password: "local-test-only", role: "technician" as const },
    RESTRICTED_TECH: { email: "e2e-restricted-tech@tiqani.local", password: "local-test-only", role: "technician" as const },
    SECOND_APPROVED: { email: "e2e-approved-tech2@tiqani.local", password: "local-test-only", role: "technician" as const },
  },

  // ── Contract UUIDs ──
  CONTRACT: {
    ACTIVE_ELIGIBLE: "2d414efd-f003-5252-938a-71cdcb2c9d22",
    OPEN_ELIGIBLE: "5a175d3e-75fe-5f52-ab36-ebb6ef4a90ed",
    COMPLETION_REQUESTED: "79024ade-500a-5fee-9123-609858dcd25e",
    PRE_SETTLEMENT: "067ad621-e8e2-5f3c-91c0-fba60aa686f1",
    SETTLED_RECOVERABLE: "d5bd4952-eb5d-5e20-b66c-177aa82239d4",
    SETTLED_PARTIAL: "098fcf67-a0df-5bc9-bacf-e5e811b8bf26",
    SETTLED_NONREC: "a3e0c06e-a4f6-56b9-a8df-6bec1b66e3c9",
    REVIEW_CONTRACT: "918ff903-5444-59ee-a010-65ffe852a686",
    MEDIATION_CONTRACT: "990cd2c5-d240-5d84-8e0d-27554e7850c8",
    PROPOSED_CONTRACT: "9265c6f3-ebf0-58cb-8ced-f82b72979afe",
    FULL_REFUND: "fd1b8468-b3b5-58b4-a824-06ed4a5b58c7",
    PARTIAL_REFUND: "61014975-d31a-56bb-99da-29913467d517",
    TECH_AWARD: "759178e4-0be8-5401-9358-6e4f701c7be1",
    SPLIT_RESOLUTION: "5826831e-daee-58fb-8812-239ee8c1210f",
    REJECTED_DISPUTE: "e2757c09-a886-5236-92a5-f1f7f0c1cc97",
    CLOSED_DISPUTE: "5e13df14-bebd-5132-8ceb-6c0641574705",
    REFUND_FAIL: "d630ff3a-496c-5cbf-a4dd-469461d286db",
  },

  // ── Dispute UUIDs ──
  DISPUTE: {
    OPEN: "4cd8052a-5896-5bdb-9f77-9aa886278ef1",
    TECHNICIAN_OPENED: "9cdfc63e-83c1-595c-8d17-0bcc30ba44f8",
    AWAITING_RESPONSE: "bb32ea51-7993-5176-9301-c4d9f3bdc55f",
    UNDER_REVIEW: "8f4018f1-b7ca-5a35-afb5-1cd9ed0534b4",
    MEDIATION: "1b2f3aca-438b-549b-b094-d5f0195125ef",
    RESOLUTION_PROPOSED: "14236255-b681-5428-a3b0-c05a0b1503da",
    FULL_REFUND: "d85d32f8-9c2d-5f7a-9504-200bfdb3e3e1",
    PARTIAL_REFUND: "f88e97dc-e3ed-5f4a-ba27-f2a8592754fd",
    TECH_AWARD: "cdfbded7-dee8-5c7a-8047-d03f41d86226",
    SPLIT_RESOLUTION: "114ec373-f73f-5583-8059-2806b89721c1",
    REJECTED: "a535ed3c-78b9-5ac8-9102-32d59af4888a",
    CLOSED: "e212d797-45fd-5cad-8e96-6dabf0907e42",
    POST_SETTLE_REFUND: "dd55f78d-99fd-57be-8348-9cadddb80166",
    MANUAL_RECOVERY: "e13470a6-6ea8-5efa-94a1-9dca03a45aaa",
    REFUND_FAIL: "696f2471-bd9b-52a4-84b3-4979eb1435b9",
  },

  // ── Evidence UUID ──
  EVIDENCE: {
    DOC_1: "2452daa3-369f-559d-b103-d79e9bedc185",
  },

  // ── Liability UUIDs ──
  LIABILITY: {
    OPEN: "4e28c165-67ff-547e-a0cf-7073a2fd7a93",
    PARTIAL: "ded1ee45-e49f-5819-bb9d-d044d9b01e86",
  },

  // ── Expected statuses ──
  STATUS: {
    OPEN: "open",
    AWAITING_RESPONSE: "awaiting_response",
    UNDER_REVIEW: "under_review",
    MEDIATION: "mediation",
    RESOLUTION_PROPOSED: "resolution_proposed",
    RESOLVED: "resolved",
    REJECTED: "rejected",
    CANCELED: "canceled",
    CLOSED: "closed",
  },

  // ── Expected financial values ──
  AMOUNT: {
    PRINCIPAL: "500000.00",
    FULL_REFUND: "500000.00",
    PARTIAL_REFUND: "200000.00",
    SPLIT_CLIENT: "250000.00",
    SPLIT_TECH: "250000.00",
    TECH_AWARD: "500000.00",
    POST_SETTLE_REFUND: "500000.00",
    MANUAL_RECOVERY: "300000.00",
  },
};
