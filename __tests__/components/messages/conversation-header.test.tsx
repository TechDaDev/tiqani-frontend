/**
 * Tests for ConversationHeader component.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConversationHeader } from "@/components/messages/conversation-header";
import type { ConversationDetail } from "@/lib/messages/types";
import { NextIntlClientProvider } from "next-intl";

const messages = {
  conversations: {
    backToList: "Back to conversations",
    status: {
      OPEN: "Open",
      CLOSED: "Closed",
      BLOCKED: "Blocked",
    },
  },
};

function mockConversation(overrides: Partial<ConversationDetail> = {}): ConversationDetail {
  return {
    id: "room-1",
    client_id: "c1",
    technician_id: "t1",
    client_user: { id: "c1", username: "c", full_name: "Client A", role: "client", profile_image: null },
    technician_user: { id: "t1", username: "t", full_name: "Tech A", role: "technician", profile_image: null },
    created_by_id: "c1",
    status: "OPEN",
    metadata: {},
    unread_count: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function renderHeader(conversation: ConversationDetail) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ConversationHeader conversation={conversation} />
    </NextIntlClientProvider>
  );
}

describe("ConversationHeader", () => {
  it("renders other user name", () => {
    renderHeader(mockConversation());
    expect(screen.getByText("Tech A")).toBeInTheDocument();
  });

  it("renders back button", () => {
    renderHeader(mockConversation());
    const backButton = screen.getByLabelText("Back to conversations");
    expect(backButton).toBeInTheDocument();
  });

  it("renders service request title when present", () => {
    renderHeader(mockConversation({ service_request_title: "Network Setup" }));
    expect(screen.getByText("Network Setup")).toBeInTheDocument();
  });

  it("renders room status badge", () => {
    renderHeader(mockConversation({ status: "OPEN" }));
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders closed status", () => {
    renderHeader(mockConversation({ status: "CLOSED" }));
    expect(screen.getByText("Closed")).toBeInTheDocument();
  });

  it("renders blocked status", () => {
    renderHeader(mockConversation({ status: "BLOCKED" }));
    expect(screen.getByText("Blocked")).toBeInTheDocument();
  });

  it("shows client name when current user is technician", () => {
    const conv = mockConversation();
    // Reverse roles to show client name
    conv.client_user.role = "technician";
    conv.technician_user.role = "client";
    conv.client_user.full_name = "Client A";
    conv.technician_user.full_name = "Tech A";
    renderHeader(conv);
    expect(screen.getByText("Client A")).toBeInTheDocument();
  });
});
