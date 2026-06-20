/**
 * Deterministic Phase 8 execution fixture IDs.
 * Must match backend seed_e2e_fixtures.py exactly.
 *
 * Generated via uuid5(NAMESPACE_DNS, "e2e-{type}-{label}.tiqani.local")
 *
 * Each mutating test uses its own contract — never share across activation,
 * milestone creation, starting, submission, revision, approval,
 * completion request, completion confirmation, completion rejection.
 */
export const EXECUTION_FIXTURES = {
  // ── Execution contracts ──────────────────────────────────────
  ACTIVATION_CONTRACT_ID: "082d285a-9529-5757-8be0-e6e0929d1f33",
  MILESTONE_CREATE_CONTRACT_ID: "694f83cb-8b96-5694-9726-aad26090e426",
  MILESTONE_REORDER_CONTRACT_ID: "4ed5058a-e811-56b3-80e7-09bde44f5531",
  MILESTONE_START_CONTRACT_ID: "889f62b0-5d34-56e6-8a20-d770573a6093",
  DELIVERABLE_SUBMIT_CONTRACT_ID: "fcbbb4d6-eb2d-544a-aaef-1754999cdf87",
  REVISION_REQUEST_CONTRACT_ID: "6d2d2264-91eb-506e-9dcd-0e69fd66c42f",
  RESUBMISSION_CONTRACT_ID: "02fcdc38-5b29-5b78-b3df-384d39d5a531",
  MILESTONE_APPROVAL_CONTRACT_ID: "06adc040-885a-5610-95c1-a25ab10661b3",
  COMPLETION_REQUEST_CONTRACT_ID: "4dd7c77f-bb3d-5dbe-a7f5-aa415560e1d3",
  COMPLETION_CONFIRM_CONTRACT_ID: "fa0d471c-6d47-5fcc-8b9b-d3484ab1950b",
  COMPLETION_REJECT_CONTRACT_ID: "270a1b43-1604-588e-a3df-d9c3c80d9f5e",
  HISTORY_CONTRACT_ID: "82f7b8f7-1ff0-52e5-b066-f16eb9803e93",

  // ── Security contracts ───────────────────────────────────────
  CLIENT_B_ONLY_CONTRACT_ID: "15e22ed4-d6b7-5d39-8b63-ea3b0d623e3e",
  TECHNICIAN_B_CONTRACT_ID: "73835af7-1299-5685-bfe3-961c189ae7f5",

  // ── Immutable completed contract ─────────────────────────────
  COMPLETED_CONTRACT_ID: "edfc936b-72c4-587e-ad58-5e0f048df997",

  // ── Milestone IDs ────────────────────────────────────────────
  ACTIVATION_MILESTONE_ID: "6e9ab596-84da-5140-9a2f-e8daba0bff09",
  REORDER_MS1_ID: "2496537e-698a-584c-9611-ec6b50f5901a",
  REORDER_MS2_ID: "3ce6a1ea-bf3f-5289-bbbb-0efbb0148ca3",
  REORDER_MS3_ID: "ed01bf96-62d1-5ea6-b815-9a5ffd15d2e6",
  START_MS_ID: "8ef09801-3b20-5f7d-b5b7-3dc1d1efc922",
  DELIVERABLE_MS_ID: "0bf89b33-830a-5530-b7f0-8bd4799560d4",
  REVISION_MS_ID: "3a8eaea0-dd73-5924-9c1a-11e252d83437",
  RESUBMISSION_MS_ID: "d736bcd3-f957-5ebc-8e50-06bf2debf584",
  APPROVAL_MS_ID: "11cd8267-028e-57be-8876-7b7063d12511",
  COMPLETION_REQ_MS_ID: "cfde2bd0-10fd-540e-930c-12339ae1ba9a",
  COMPLETION_CONFIRM_MS_ID: "96576580-08ba-5880-81e3-e57f2354afcc",
  COMPLETION_REJECT_MS_ID: "c5e92111-5b9c-5386-8314-26174f85cd7c",
  COMPLETED_MS_ID: "70d56420-356b-59cc-9312-ee96456e0c11",

  // ── Submission IDs ───────────────────────────────────────────
  REVISION_SUBMISSION_ID: "d2ff6054-ba69-5ab7-bb7b-829a774259e2",
  RESUBMISSION_SUB_ID: "7ac87168-1095-5b08-bf9e-88ebfe695610",
  APPROVAL_SUBMISSION_ID: "10ee4d68-3546-51cf-b448-91164c8d6e46",

  // ── Completion request IDs ───────────────────────────────────
  CONFIRM_COMPLETION_REQ_ID: "662a9153-8c99-53f9-b158-7be613f68bbe",
  REJECT_COMPLETION_REQ_ID: "a14f9b1a-82ad-5b17-9d35-8dc40fe242a1",
  COMPLETED_COMPLETION_REQ_ID: "4214df25-2285-56b3-ba44-1ee8efc72492",

  // ── History event IDs ────────────────────────────────────────
  HISTORY_EVENT_1_ID: "4d28b7d9-7c50-58a7-8316-925a2354a45c",
  HISTORY_EVENT_2_ID: "2dc5f3ec-3e5b-5e74-940a-9ee325e12559",
} as const;
