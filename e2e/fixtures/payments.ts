/**
 * Deterministic payment fixture IDs — must match backend seed_e2e_fixtures.py.
 * Generated via uuid5(NAMESPACE_DNS, "e2e-{type}-{label}.tiqani.local")
 *
 * Each mutating test uses its OWN contract so tests never pollute each other.
 */
export const PAYMENT_FIXTURES = {
  // ── Mutable (unfunded) contracts ──────────────────────────────
  SUCCESS_CONTRACT_ID: "f872e161-f2a2-5925-a4d1-de4cc9d208d2",
  FAILURE_CONTRACT_ID: "3430c009-26a6-573e-8725-836aa2426316",
  DOUBLE_CLICK_CONTRACT_ID: "92336219-bdc8-5cb6-bc95-b885381f835b",
  DUPLICATE_CONFIRM_CONTRACT_ID: "89a7e54e-3130-506f-9ee3-5c27c70e50eb",
  LOGOUT_CONTRACT_ID: "fe961321-eb46-58a5-a322-f03553646b00",
  LOCALIZATION_CONTRACT_ID: "d1dd0923-88bb-5244-8b91-74e97c6ed451",
  RESPONSIVE_CONTRACT_ID: "85052d24-3508-5106-a685-4747e48aeb44",

  // ── Legacy (backward compat) ─────────────────────────────────
  CLIENT_A_UNFUNDED_CONTRACT_ID: "3c6503e0-df13-588b-9d77-a3e1dfc23749",
  CLIENT_A_FAILURE_CONTRACT_ID: "3430c009-26a6-573e-8725-836aa2426316",
  CLIENT_A_PENDING_INTENT_ID: "56be13cb-2887-52c7-a539-d1a06b2a3fae",
  CLIENT_A_FAILED_INTENT_ID: "03582a80-f0f7-5df6-811c-7e8516ae14e7",
  CLIENT_A_FUNDED_CONTRACT_ID: "02db5487-b48f-5eb9-8599-7cd477fea0e3",
  CLIENT_A_SUCCESS_INTENT_ID: "b6d62919-1984-5eab-b596-87133f260678",
  CLIENT_B_FUNDED_CONTRACT_ID: "9d0bb320-cc48-54b5-91c1-8b49c6e4cbfd",
  TECHNICIAN_B_CONTRACT_ID: "9d0bb320-cc48-54b5-91c1-8b49c6e4cbfd",

  // ── New immutable fixtures ────────────────────────────────────
  PENDING_VIEW_CONTRACT_ID: "3db4c549-571d-5973-818b-353b31f216b5",
  FUNDED_VIEW_CONTRACT_ID: "36e7bd72-780f-527e-a888-93107709dd99",
} as const;
