/**
 * E2E test fixtures for service request tests.
 *
 * These match the backend seed_e2e_fixtures deterministic data.
 * Verified against live backend on 2026-06-16.
 */
export const REQUEST_FIXTURES = {
  pending: { uuid: "e1342197-4816-5770-8a0c-dc3bef807241", title: "Fix AC Unit", status: "PENDING" },
  accepted: { uuid: "5dfdbfd7-3f17-5357-a627-331ce005bea1", title: "Install Smart Lock", status: "ACCEPTED" },
  declined: { uuid: "fb2ce19a-c047-5c65-b8fb-693656fd2915", title: "Fix Leaking Pipe", status: "DECLINED" },
  cancelled: { uuid: "c60ddfb3-ecb1-5421-a9d9-ef2b70844bf5", title: "Paint Living Room", status: "CANCELLED" },
  withdrawn: { uuid: "282e5a93-84e0-5449-be4c-a2aab14cd3a6", title: "Fix Garden Fence", status: "WITHDRAWN" },
  crossClient: { uuid: "9cfca23a-2dee-5a7e-a0fd-0925efd4b8cf", title: "Cross-Client Request", status: "PENDING" },
  altPending: { uuid: "50bbd919-dd94-4125-a1de-35a2162eac9a", title: "AC Repair", status: "CANCELLED" },
} as const;

/**
 * E2E fixture usernames and credentials (matches backend seed command).
 */
export const REQUEST_USER_FIXTURES = {
  client: { username: "e2e_client", password: "local-test-only" },
  technician: { username: "e2e_approved_tech", password: "local-test-only" },
  technician2: { username: "e2e_approved_tech2", password: "local-test-only" },
  altClient: { username: "e2e_client2", password: "local-test-only" },
  restrictedTech: {
    username: "e2e_restricted_tech",
    password: "local-test-only",
  },
} as const;

/**
 * Backend endpoints for service requests.
 */
export const REQUEST_ENDPOINTS = {
  clientList: "/api/requests/",
  technicianInbox: "/api/technician/requests/",
} as const;

/**
 * Frontend page paths for service requests.
 */
export const REQUEST_PAGES = {
  clientList: "/ar/client/requests",
  clientNew: "/ar/client/requests/new",
  technicianList: "/ar/technician/requests",
  clientDetail: (id: string) => `/ar/client/requests/${id}`,
  technicianDetail: (id: string) => `/ar/technician/requests/${id}`,
} as const;

/**
 * Expected status display values (from i18n keys mapped by RequestStatusBadge).
 */
export const REQUEST_STATUS_LABELS = {
  PENDING: "requestStatus.pending",
  ACCEPTED: "requestStatus.accepted",
  DECLINED: "requestStatus.declined",
  CANCELLED: "requestStatus.cancelled",
  WITHDRAWN: "requestStatus.withdrawn",
} as const;
