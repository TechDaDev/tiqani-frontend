/**
 * Deterministic Phase 9 fixture IDs — must match backend seed_e2e_fixtures.py.
 * Generated via uuid5(NAMESPACE_DNS, "e2e-p9-{label}.tiqani.local")
 *
 * Each mutating test uses its OWN contract/withdrawal so tests never pollute each other.
 *
 * Financial assumptions (PlatformFeeConfig: tech 10%, client 5%):
 *   eligible:   principal=500000, tech_net=450000, commission=50000, client_fee=25000
 *   already-settled: principal=300000, tech_net=270000
 *   duplicate:  principal=400000, tech_net=360000, client_total=420000
 *   idor:       principal=250000, tech_net=225000, client_total=262500
 *   mismatch:   principal=350000, tech_net=315000, client_total=367500
 */
export const SETTLEMENT_FIXTURES = {
  // ── Contracts ───────────────────────────────────────────────
  ELIGIBLE_CONTRACT_ID: "78b32fcc-6f15-5041-a7f0-96d0c55ae535",
  ALREADY_SETTLED_CONTRACT_ID: "56501184-6739-5d52-a907-9a73ef913d1d",
  ACTIVE_CONTRACT_ID: "171740cc-5352-598c-84a8-bb556f14987f",
  UNFUNDED_CONTRACT_ID: "ac0a8bdd-2b76-56ae-9dce-269d6fc6fd26",
  ZERO_ESCROW_CONTRACT_ID: "e1171b15-8822-5bfd-8fcf-9617596f33c2",
  DUPLICATE_CONTRACT_ID: "cbcf419d-0358-512a-9dca-8a1f9c83c864",
  IDOR_CONTRACT_ID: "5e0dc530-7a8b-5509-86be-33302d14c47c",
  MISMATCH_CONTRACT_ID: "47309c9d-a4bc-566e-9db4-295fc99dcd72",

  // ── Withdrawal amounts ──────────────────────────────────────
  WITHDRAWAL_AMOUNT: "10000.00",
  MINIMUM_WITHDRAWAL: "1000.00",

  // ── Financial values for eligible contract ──────────────────
  ELIGIBLE_PRINCIPAL: "500000.00",
  ELIGIBLE_TECH_NET: "450000.00",
  ELIGIBLE_COMMISSION: "50000.00",
  ELIGIBLE_CLIENT_FEE: "25000.00",
  ELIGIBLE_CLIENT_TOTAL: "525000.00",
  ELIGIBLE_PLATFORM_REVENUE: "75000.00",

  // ── Financial values for duplicate contract ─────────────────
  DUPLICATE_TECH_NET: "360000.00",
  DUPLICATE_CLIENT_TOTAL: "420000.00",

  // ── Financial values for IDOR contract ──────────────────────
  IDOR_TECH_NET: "225000.00",
  IDOR_CLIENT_TOTAL: "262500.00",

  // ── Financial values for mismatch contract ──────────────────
  MISMATCH_TECH_NET: "315000.00",
  MISMATCH_CLIENT_TOTAL: "367500.00",

  // ── Already-settled values ──────────────────────────────────
  SETTLED_TECH_NET: "270000.00",
} as const;
