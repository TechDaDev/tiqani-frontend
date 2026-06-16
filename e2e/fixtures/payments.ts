/**
 * Deterministic payment fixture IDs for Playwright E2E tests.
 *
 * These must match the seed_e2e_fixtures.py output.
 */
export const PAYMENT_FIXTURES = {
  /** Client A unfunded eligible contract */
  CLIENT_A_UNFUNDED_CONTRACT_ID: "10000000-0000-0000-0000-000000000001",
  /** Client A failure-test eligible contract */
  CLIENT_A_FAILURE_CONTRACT_ID: "10000000-0000-0000-0000-000000000002",
  /** Client A pending payment intent */
  CLIENT_A_PENDING_INTENT_ID: "20000000-0000-0000-0000-000000000001",
  /** Client A failed payment intent */
  CLIENT_A_FAILED_INTENT_ID: "20000000-0000-0000-0000-000000000002",
  /** Client A funded contract */
  CLIENT_A_FUNDED_CONTRACT_ID: "10000000-0000-0000-0000-000000000003",
  /** Client A successful payment intent */
  CLIENT_A_SUCCESS_INTENT_ID: "20000000-0000-0000-0000-000000000003",
  /** Client B funded contract for IDOR */
  CLIENT_B_FUNDED_CONTRACT_ID: "10000000-0000-0000-0000-000000000010",
  /** Technician B associated contract */
  TECHNICIAN_B_CONTRACT_ID: "10000000-0000-0000-0000-000000000020",
} as const;

export const PAYMENT_USERS = {
  CLIENT_A: { email: "e2e_client@test.com", password: "local-test-only" },
  CLIENT_B: { email: "e2e_client_b@test.com", password: "local-test-only" },
  TECHNICIAN_A: { email: "e2e_technician@test.com", password: "local-test-only" },
  TECHNICIAN_B: { email: "e2e_technician_b@test.com", password: "local-test-only" },
} as const;
