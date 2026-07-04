import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PaymentsTable } from "@/components/admin/financial/payments-table";
import { FinancialStatusBadge } from "@/components/admin/financial/financial-status-badge";
import { formatMoney, maskReference } from "@/lib/admin/financial/format";
import {
  mapFinancialOverview,
  mapFinancialPayment,
  mapFinancialLedgerEntry,
} from "@/lib/admin/financial/mappers";
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

  it("maps financial overview money strings and empty charts", () => {
    const overview = mapFinancialOverview({
      summary: {
        grossPayments: "10.00",
        netPlatformFees: "1.00",
        pendingWithdrawals: "2.00",
        completedWithdrawals: "3.00",
        refundsIssued: "4.00",
        escrowHeld: "5.00",
        openLiabilities: "0.00",
        walletBalanceTotal: "20.00",
      },
      counts: {},
      charts: {},
      recentActivity: [],
    });
    expect(overview.summary.grossPayments).toBe("10.00");
    expect(overview.charts.paymentsByStatus).toEqual([]);
  });

  it("formats money and masks references", () => {
    expect(formatMoney("1200.00", "IQD", "en")).toContain("IQD");
    expect(maskReference("provider-reference-1234")).toBe("prov...1234");
  });

  it("maps financial payments without raw provider metadata", () => {
    const payment = mapFinancialPayment({
      id: "pay-1",
      amount: "25.00",
      provider_reference_masked: "prov...1234",
      metadata: { secret: "no" },
      payer: { id: "u1", name: "Client" },
    });
    expect(payment.providerReferenceMasked).toBe("prov...1234");
    expect(JSON.stringify(payment)).not.toContain("secret");
  });

  it("maps read-only ledger rows", () => {
    const entry = mapFinancialLedgerEntry({
      id: "l1",
      transaction_type: "escrow",
      direction: "debit",
      amount: "50.00",
      source_object: { type: "contract", id: "c1" },
    });
    expect(entry.transactionType).toBe("escrow");
    expect(entry.direction).toBe("debit");
  });

  it("renders financial status badges", () => {
    render(<FinancialStatusBadge status="paid" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("renders payment table safe values", () => {
    render(
      <PaymentsTable
        locale="en"
        items={[{
          id: "payment-id-1",
          contract: "contract-id",
          contractReference: "CTR-1",
          payer: { id: "u1", name: "Client" },
          amount: "100.00",
          currency: "IQD",
          purpose: "contract_funding",
          provider: "manual",
          providerReferenceMasked: "prov...1234",
          status: "paid",
          paidAt: "",
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        }]}
      />
    );
    expect(screen.getByText("Client")).toBeInTheDocument();
    expect(screen.getByText(/manual\s+prov\.\.\.1234/)).toBeInTheDocument();
  });
});
