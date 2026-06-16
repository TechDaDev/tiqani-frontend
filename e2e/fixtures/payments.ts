/**
 * Deterministic payment fixture IDs — must match backend seed_e2e_fixtures.py.
 * Generated via uuid5(NAMESPACE_DNS, "e2e-{type}-{label}.tiqani.local")
 */
export const PAYMENT_FIXTURES = {
  CLIENT_A_UNFUNDED_CONTRACT_ID: "3c6503e0-df13-588b-9d77-a3e1dfc23749",
  CLIENT_A_FAILURE_CONTRACT_ID: "3430c009-26a6-573e-8725-836aa2426316",
  CLIENT_A_PENDING_INTENT_ID: "56be13cb-2887-52c7-a539-d1a06b2a3fae",
  CLIENT_A_FAILED_INTENT_ID: "03582a80-f0f7-5df6-811c-7e8516ae14e7",
  CLIENT_A_FUNDED_CONTRACT_ID: "02db5487-b48f-5eb9-8599-7cd477fea0e3",
  CLIENT_A_SUCCESS_INTENT_ID: "b6d62919-1984-5eab-b596-87133f260678",
  CLIENT_B_FUNDED_CONTRACT_ID: "9d0bb320-cc48-54b5-91c1-8b49c6e4cbfd",
  TECHNICIAN_B_CONTRACT_ID: "9d0bb320-cc48-54b5-91c1-8b49c6e4cbfd",
} as const;
