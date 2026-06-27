import { describe, expect, it } from "vitest";
import {
  mapAdminDashboard,
  mapAdminTechnician,
  mapAdminUser,
  mapAuditEvent,
  mapPaginated,
  mapPlatformHealth,
} from "@/lib/admin/mappers";

describe("Phase 12 admin mappers", () => {
  it("maps dashboard aggregates with numeric fallback", () => {
    const dashboard = mapAdminDashboard({
      users: { total: "3", active: 2 },
      technicians: { pending: 1 },
      contracts: { total: 4 },
      finance: { withdrawals_pending: "5" },
      reviews: { hidden: 1 },
      notifications: { unread: 9 },
    });
    expect(dashboard.users.total).toBe(3);
    expect(dashboard.finance.withdrawals_pending).toBe("5");
    expect(dashboard.notifications.unread).toBe(9);
  });

  it("maps paginated and non-paginated responses", () => {
    const paginated = mapPaginated({ count: 1, results: [{ id: "a" }] }, (item) => item as { id: string });
    const list = mapPaginated([{ id: "b" }], (item) => item as { id: string });
    expect(paginated.count).toBe(1);
    expect(list.results[0].id).toBe("b");
  });

  it("maps admin users without password or token fields", () => {
    const user = mapAdminUser({
      id: "u1",
      username: "client",
      email: "client@example.com",
      role: "client",
      role_display: "Client",
      is_active: true,
      password: "hash",
      token: "secret",
    });
    expect(user.username).toBe("client");
    expect(JSON.stringify(user)).not.toContain("hash");
    expect(JSON.stringify(user)).not.toContain("secret");
  });

  it("maps technician approval fields", () => {
    const tech = mapAdminTechnician({
      id: "t1",
      username: "tech",
      email: "tech@example.com",
      job_title: "Network",
      approved: true,
      is_available: false,
    });
    expect(tech.approved).toBe(true);
    expect(tech.isAvailable).toBe(false);
  });

  it("maps audit metadata safely", () => {
    const event = mapAuditEvent({
      id: "e1",
      verb: "user_suspended",
      actor_name: "admin",
      metadata: { reason: "Policy" },
    });
    expect(event.verb).toBe("user_suspended");
    expect(event.metadata.reason).toBe("Policy");
  });

  it("maps system health", () => {
    const health = mapPlatformHealth({ status: "ok", database: "ok", redis: "configured", debug: false });
    expect(health.status).toBe("ok");
    expect(health.debug).toBe(false);
  });
});
