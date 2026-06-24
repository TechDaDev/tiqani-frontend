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
    OPEN: "d5f18282-be8f-591c-939a-86c7f7808491",
    TECHNICIAN_OPENED: "ff841721-2ffd-59c2-ac0c-1c313eb8590b",
    AWAITING_RESPONSE: "5d67c1ba-55fe-5903-b7cb-8d86893943ee",
    UNDER_REVIEW: "05907aff-e96a-5dd2-88ff-cc2a33f0e59a",
    MEDIATION: "f73c9033-7f2d-511d-b1eb-8b67ee2245a5",
    RESOLUTION_PROPOSED: "0449a027-4655-55fc-b322-427a739fff2b",
    FULL_REFUND: "d85d32f8-9c2d-5f7a-9504-200bfdb3e3e1",
    PARTIAL_REFUND: "f88e97dc-e3ed-5f4a-ba27-f2a8592754fd",
    TECH_AWARD: "cdfbded7-dee8-5c7a-8047-d03f41d86226",
    SPLIT_RESOLUTION: "114ec373-f73f-5583-8059-2806b89721c1",
    REJECTED: "693be793-18c4-5c49-a961-a0146bbbd366",
    CLOSED: "c5fecedd-3dab-5caf-a849-0941af14ceca",
    POST_SETTLE_REFUND: "224955c6-2119-5de5-862f-908359605b27",
    MANUAL_RECOVERY: "eadeb194-ce2d-5f6f-8007-eda118076dcd",
    REFUND_FAIL: "696f2471-bd9b-52a4-84b3-4979eb1435b9",
  },

  // ── Evidence UUID ──
  EVIDENCE: {
    DOC_1: "2452daa3-369f-559d-b103-d79e9bedc185",
  },

  // ── Liability UUIDs ──
  LIABILITY: {
    OPEN: "9520b69c-47e1-5106-b4e8-db83136c1a20",
    PARTIAL: "32aba08d-133f-56c9-a5e5-c41992a32ad7",
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
