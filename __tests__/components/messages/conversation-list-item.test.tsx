/**
 * Tests for ConversationListItem component.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConversationListItem } from "@/components/messages/conversation-list-item";
import type { Conversation } from "@/lib/messages/types";
import { NextIntlClientProvider } from "next-intl";

const messages = {
  conversations: {
    conversationWith: "Conversation with",
    noMessages: "No messages yet",
  },
  unreadMessages: {
    ariaLabel: "{count} unread {count, plural, one {message} other {messages}}",
  },
};

function mockConversation(overrides: Partial<Conversation> = {}): Conversation {
  return {
    id: "room-1",
    status: "OPEN",
    client_user: { id: "c1", username: "c", full_name: "Client A", role: "client", profile_image: null },
    technician_user: { id: "t1", username: "t", full_name: "Tech A", role: "technician", profile_image: null },
    unread_count: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function renderItem(conversation: Conversation) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ConversationListItem conversation={conversation} />
    </NextIntlClientProvider>
  );
}

describe("ConversationListItem", () => {
  it("renders link to conversation", () => {
    renderItem(mockConversation());
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/messages/room-1");
  });

  it("shows other user name", () => {
    renderItem(mockConversation());
    // For client role, shows technician name
    expect(screen.getByText("Tech A")).toBeInTheDocument();
  });

  it("shows no messages fallback", () => {
    renderItem(mockConversation());
    expect(screen.getByText("No messages yet")).toBeInTheDocument();
  });

  it("shows service request title when present", () => {
    renderItem(mockConversation({ service_request_title: "Network Setup" }));
    expect(screen.getByText("Network Setup")).toBeInTheDocument();
  });

  it("shows unread badge when unread count > 0", () => {
    renderItem(mockConversation({ unread_count: 3 }));
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("hides unread badge when unread count is 0", () => {
    renderItem(mockConversation({ unread_count: 0 }));
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("shows last message preview when available", () => {
    renderItem(mockConversation({
      last_message_preview: { id: "m1", message_type: "TEXT", preview: "Hello there", sender_id: "t1", created_at: "2026-01-01T00:00:00Z" },
    }));
    expect(screen.getByText("Hello there")).toBeInTheDocument();
  });

  it("has accessible aria-label", () => {
    renderItem(mockConversation());
    const link = screen.getByRole("link");
    expect(link.getAttribute("aria-label")).toContain("Conversation with");
  });
});

export {};
