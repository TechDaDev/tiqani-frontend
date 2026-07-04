import { describe, expect, it } from "vitest";
import {
  mapAdminDashboard,
  mapAdminTechnicianDetail,
  mapAdminTechnician,
  mapAdminUser,
  mapAuditEvent,
  mapPaginated,
  mapPlatformHealth,
} from "@/lib/admin/mappers";
import { getTechnicianApprovalReasonKey, technicianDocumentHref } from "@/lib/admin/technician-review";

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

  it("maps technician review documents and checklist safely", () => {
    const tech = mapAdminTechnicianDetail({
      id: "t1",
      user: {
        id: "u1",
        username: "tech",
        email: "tech@example.com",
        is_active: true,
      },
      job_title: "Network",
      approved: false,
      is_available: true,
      github: "https://github.com/testtech",
      linkedin: "https://linkedin.com/in/testtech",
      has_documents: true,
      documents: [{
        id: "identification_documents",
        name: "id.pdf",
        type: "application/pdf",
        status: "uploaded",
        size: 1024,
        download_url: "/api/admin/technicians/t1/documents/identification_documents/",
      }],
      approval_requirements: {
        can_approve: true,
        missing: [],
        checklist: [{ key: "documents", passed: true }],
      },
    });

    expect(tech.documents[0].name).toBe("id.pdf");
    expect(tech.documents[0].downloadUrl).toBe("/api/admin/technicians/t1/documents/identification_documents/");
    expect(tech.approvalRequirements.checklist[0]).toEqual({ key: "documents", passed: true });
    expect(JSON.stringify(tech)).not.toContain("technicians/docs/id.pdf");
  });

  it("returns approval block reasons for missing requirements", () => {
    const base = mapAdminTechnicianDetail({
      id: "t1",
      user: { id: "u1", username: "tech", email: "tech@example.com", is_active: true },
      approval_requirements: {
        can_approve: false,
        missing: ["documents"],
        checklist: [{ key: "documents", passed: false }],
      },
    });

    expect(getTechnicianApprovalReasonKey(base)).toBe("missingDocuments");
    expect(getTechnicianApprovalReasonKey({
      ...base,
      approvalRequirements: { ...base.approvalRequirements, missing: ["github_url"] },
    })).toBe("missingGithub");
    expect(getTechnicianApprovalReasonKey({
      ...base,
      approvalRequirements: { ...base.approvalRequirements, missing: ["linkedin_url"] },
    })).toBe("missingLinkedin");
  });

  it("builds safe same-origin document links", () => {
    expect(technicianDocumentHref("tech-id", "identification_documents"))
      .toBe("/api/admin/technicians/tech-id/documents/identification_documents");
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
