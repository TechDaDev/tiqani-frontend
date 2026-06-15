/**
 * Tests for RequestCard component.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RequestCard } from "@/components/requests/request-card";
import type { ServiceRequest } from "@/lib/requests/types";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const baseRequest: ServiceRequest = {
  id: "req-1",
  client: { user_id: "u1", username: "client1", full_name: "Test Client" },
  technician: { user_id: "u2", username: "tech1", full_name: "Test Technician", job_title: "Electrician" },
  title: "Fix Garden Fence",
  description: "The wooden fence at the back of the garden has several broken panels.",
  status: "PENDING",
  is_urgent: false,
  created_at: "2026-06-15T10:00:00Z",
  updated_at: "2026-06-15T10:00:00Z",
};

describe("RequestCard", () => {
  it("renders request title and description", () => {
    render(<RequestCard request={baseRequest} href="/client/requests/req-1" />);
    expect(screen.getByText("Fix Garden Fence")).toBeDefined();
    expect(screen.getByText(/broken panels/)).toBeDefined();
  });

  it("renders technician info by default", () => {
    render(<RequestCard request={baseRequest} href="/client/requests/req-1" />);
    expect(screen.getByText(/Test Technician/)).toBeDefined();
    expect(screen.getByText(/Electrician/)).toBeDefined();
  });

  it("renders client info when showClient is true", () => {
    render(
      <RequestCard
        request={baseRequest}
        href="/technician/requests/req-1"
        showTechnician={false}
        showClient={true}
      />
    );
    expect(screen.getByText(/Test Client/)).toBeDefined();
  });

  it("hides technician info when showTechnician is false", () => {
    render(
      <RequestCard request={baseRequest} href="/client/requests/req-1" showTechnician={false} />
    );
    expect(screen.queryByText(/Test Technician/)).toBeNull();
  });

  it("renders urgent badge when is_urgent is true", () => {
    const urgentRequest = { ...baseRequest, is_urgent: true };
    render(<RequestCard request={urgentRequest} href="/client/requests/req-1" />);
    expect(screen.getByText("requestCard.urgent")).toBeDefined();
  });

  it("does not render urgent badge when is_urgent is false", () => {
    render(<RequestCard request={baseRequest} href="/client/requests/req-1" />);
    expect(screen.queryByText("requestCard.urgent")).toBeNull();
  });

  it("renders preferred date when provided", () => {
    const withDate = { ...baseRequest, preferred_date: "2026-07-01" };
    render(<RequestCard request={withDate} href="/client/requests/req-1" />);
    expect(screen.getByText(/2026-07-01/)).toBeDefined();
  });

  it("renders status badge", () => {
    render(<RequestCard request={baseRequest} href="/client/requests/req-1" />);
    expect(screen.getByText("requestStatus.pending")).toBeDefined();
  });

  it("renders a link with the provided href", () => {
    render(<RequestCard request={baseRequest} href="/client/requests/req-1" />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/client/requests/req-1");
  });

  it("renders with minimal optional fields", () => {
    const minimal: ServiceRequest = {
      id: "req-2",
      client: { user_id: "u1", username: "client1", full_name: "Client" },
      technician: { user_id: "u2", username: "tech1", full_name: "" },
      title: "Fix",
      description: "Fix it.",
      status: "ACCEPTED",
      is_urgent: false,
      created_at: "",
      updated_at: "",
    };
    render(<RequestCard request={minimal} href="/client/requests/req-2" />);
    expect(screen.getByText("Fix")).toBeDefined();
    expect(screen.getByText("requestStatus.accepted")).toBeDefined();
  });
});
