/**
 * Phase 11 fixture identifiers.
 *
 * UUIDs match backend seed_e2e_fixtures.py:
 * uuid5(NAMESPACE_DNS, "e2e-p11-{label}.tiqani.local")
 */
export const PHASE11 = {
  USER: {
    CLIENT: "e2e_client",
    APPROVED_TECH: "e2e_approved_tech",
    SECOND_TECH: "e2e_approved_tech2",
    STAFF: "vstaff_p19",
    PASSWORD: "local-test-only",
  },
  CONTRACT: {
    CLIENT_REVIEW_ELIGIBLE: "d9bbe16f-5cce-51fe-af21-68ca96f2a14b",
    CREATE_REVIEW: "15c9e041-7a85-58d9-9bd6-bf8354150122",
    TECHNICIAN_REVIEW_ELIGIBLE: "a6053bf1-701b-577e-9218-bff622c02b61",
    INCOMPLETE: "2a42a94f-9340-5a32-a804-b0d22edd9b3b",
    DISPUTED: "38710fdb-70c5-5e52-a175-fa52aef86783",
    REVIEWED: "a6705066-6dee-50b3-9ea2-b6cb64fafa5b",
  },
  REVIEW: {
    PUBLISHED: "4aa4b89f-6853-5b21-a451-8ade3250c83c",
    HIDDEN: "5f497725-3496-5c14-bd34-a2b8f0c3d859",
    REPORTED: "22230145-641e-58f9-b496-17ff85cbbd0a",
    REPORT: "8cf9f43b-0fb2-5d13-a7ed-c8382ed8db78",
  },
  NOTIFICATION: {
    UNREAD: "6c0c3aaa-c88a-52e4-b6c6-3f6cd25acada",
    READ: "8d3bd7ba-90a7-5153-8df2-840e8a029f7b",
    OWNER_B: "67b3176e-a609-53b2-902d-75e9c7e5f387",
  },
} as const;
