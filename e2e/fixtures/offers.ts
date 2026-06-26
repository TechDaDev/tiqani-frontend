/**
 * E2E test fixtures for offer tests.
 *
 * These match the backend seed_e2e_fixtures deterministic data.
 * See accounts/management/commands/seed_e2e_fixtures.py for source.
 */
export const OFFER_FIXTURES = {
  submitted: {
    uuid: "a2106ae0-b231-50ab-8a76-030b9073b3b7",
    amount: "150000.00",
    status: "SUBMITTED",
  },
  forRejection: {
    uuid: "c62057d6-9814-54c7-b71e-f3af738a4216",
    amount: "250000.00",
    status: "SUBMITTED",
  },
  accepted: {
    uuid: "ab9e2ec2-b3fc-501b-a539-781005e5cb07",
    amount: "120000.00",
    status: "ACCEPTED",
    contractUuid: "f603b727-4044-5ef0-a5cf-a0198dfcfa5c",
  },
  withdrawn: {
    uuid: "4a4f6261-23c5-5443-b6ff-0f943734d0cf",
    amount: "50000.00",
    status: "WITHDRAWN",
  },
  crossClient: {
    uuid: "535163da-668c-5841-826f-c8cc84667227",
    amount: "180000.00",
    status: "SUBMITTED",
  },
} as const;

export const OFFER_CONTRACT_FIXTURES = {
  fromAcceptedOffer: {
    uuid: "f603b727-4044-5ef0-a5cf-a0198dfcfa5c",
  },
} as const;

export const OFFER_REQUEST_FIXTURES = {
  accepted: {
    uuid: "5dfdbfd7-3f17-5357-a627-331ce005bea1",
    title: "Install Smart Lock",
    status: "ACCEPTED",
  },
  offerCreate: {
    uuid: "8a6fd0e2-2fac-532c-88da-54de24740872",
    title: "Install Video Doorbell",
    status: "ACCEPTED",
  },
} as const;

export const OFFER_USER_FIXTURES = {
  client: { username: "e2e_client", password: "local-test-only" },
  clientB: { username: "e2e_client2", password: "local-test-only" },
  approvedTech: { username: "e2e_approved_tech", password: "local-test-only" },
  approvedTech2: { username: "e2e_approved_tech2", password: "local-test-only" },
} as const;

export const OFFER_PAGES = {
  technicianList: "/en/technician/offers",
  technicianDetail: (id: string) => `/en/technician/offers/${id}`,
  createOffer: (requestId: string) => `/en/technician/offers/new/${requestId}`,
  clientList: "/en/offers",
  clientDetail: (id: string) => `/en/offers/${id}`,
  contractDetail: (id: string) => `/en/contracts/${id}`,
} as const;
