/**
 * Tests for ConversationList component.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConversationList } from "@/components/messages/conversation-list";
import { NextIntlClientProvider } from "next-intl";

// Mock the query hook
vi.mock("@/lib/messages/query", () => ({
  useConversations: vi.fn(),
}));

import { useConversations } from "@/lib/messages/query";

const messages = {
  conversations: {
    title: "Messages",
    loading: "Loading conversations...",
    error: "Failed to load conversations.",
    empty: "No conversations yet.",
    retry: "Retry",
    conversationList: "Conversations",
    conversationWith: "Conversation with",
    noMessages: "No messages yet",
  },
};

const mockUseConversations = useConversations as ReturnType<typeof vi.fn>;

describe("ConversationList", () => {
  it("shows loading state", () => {
    mockUseConversations.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ConversationList />
      </NextIntlClientProvider>
    );

    expect(screen.getAllByRole("status")).toBeDefined();
  });

  it("shows error state", () => {
    mockUseConversations.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed"),
      refetch: vi.fn(),
    });

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ConversationList />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    mockUseConversations.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ConversationList />
      </NextIntlClientProvider>
    );

    expect(screen.getByText("No conversations yet.")).toBeInTheDocument();
  });

  it("renders conversation items", () => {
    mockUseConversations.mockReturnValue({
      data: [
        {
          id: "room-1",
          status: "OPEN",
          client_user: { id: "c1", username: "c", full_name: "Client A", role: "client", profile_image: null },
          technician_user: { id: "t1", username: "t", full_name: "Tech A", role: "technician", profile_image: null },
          unread_count: 0,
          created_at: "",
          updated_at: "",
        },
        {
          id: "room-2",
          status: "CLOSED",
          client_user: { id: "c2", username: "c2", full_name: "Client B", role: "client", profile_image: null },
          technician_user: { id: "t2", username: "t2", full_name: "Tech B", role: "technician", profile_image: null },
          unread_count: 2,
          created_at: "",
          updated_at: "",
        },
      ],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ConversationList />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});
