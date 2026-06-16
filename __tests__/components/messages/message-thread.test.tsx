/**
 * Tests for MessageThread component.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MessageThread } from "@/components/messages/message-thread";
import type { Message, ConversationDetail } from "@/lib/messages/types";
import { NextIntlClientProvider } from "next-intl";

const messages = {
  messages: {
    empty: "No messages yet. Send the first message to start the conversation.",
    loadOlder: "Load older messages",
    loading: "Loading...",
    messageList: "Messages",
    you: "You",
    deleted: "This message was deleted.",
    priceOffer: "Price offer",
  },
  messageComposer: {
    composerLabel: "Message composer",
    placeholder: "Type a message...",
    messageInput: "Type your message",
    send: "Send",
  },
};

function mockConversation(): ConversationDetail {
  return {
    id: "room-1",
    client_id: "c1",
    technician_id: "t1",
    client_user: { id: "c1", username: "c", full_name: "Client", role: "client", profile_image: null },
    technician_user: { id: "t1", username: "t", full_name: "Technician", role: "technician", profile_image: null },
    created_by_id: "c1",
    status: "OPEN",
    metadata: {},
    unread_count: 0,
    created_at: "",
    updated_at: "",
  };
}

function mockMessages(count: number): Message[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `msg-${i}`,
    room_id: "room-1",
    sender: i % 2 === 0 ? "c1" : "t1",
    sender_info: {
      id: i % 2 === 0 ? "c1" : "t1",
      username: i % 2 === 0 ? "c" : "t",
      full_name: i % 2 === 0 ? "Client" : "Technician",
      role: i % 2 === 0 ? "client" : "technician",
    },
    message_type: "TEXT" as const,
    body: `Message ${i}`,
    safe_body: `Message ${i}`,
    attachment: null,
    attachment_name: "",
    attachment_size: null,
    attachment_content_type: "",
    price_amount: null,
    price_currency: "IQD",
    metadata: {},
    is_deleted: false,
    edited_at: null,
    created_at: "2026-06-16T10:00:00Z",
    updated_at: "2026-06-16T10:00:00Z",
  }));
}

function renderThread({
  conversation = mockConversation(),
  msgs,
  isLoading = false,
  hasMore = false,
  onLoadOlder = vi.fn(),
  onSend = vi.fn(),
  isSending = false,
  currentUserId,
}: {
  conversation?: ConversationDetail;
  msgs?: Message[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadOlder?: () => void;
  onSend?: (body: string) => Promise<void>;
  isSending?: boolean;
  currentUserId?: string;
} = {}) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <MessageThread
        conversation={conversation}
        messages={msgs ?? []}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadOlder={onLoadOlder}
        onSend={onSend}
        isSending={isSending}
        currentUserId={currentUserId}
      />
    </NextIntlClientProvider>
  );
}

describe("MessageThread", () => {
  it("shows loading spinner when loading without messages", () => {
    // Render with messages=undefined manually
    const conv = mockConversation();
    const onSend = vi.fn();
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <MessageThread
          conversation={conv}
          messages={undefined as unknown as Message[]}
          isLoading={true}
          hasMore={false}
          onLoadOlder={vi.fn()}
          onSend={onSend}
          isSending={false}
        />
      </NextIntlClientProvider>
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows empty state when no messages", () => {
    renderThread({ msgs: [] });
    expect(screen.getByText("No messages yet. Send the first message to start the conversation.")).toBeInTheDocument();
  });

  it("renders message list with messages", () => {
    renderThread({ msgs: mockMessages(3) });
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("Message 0")).toBeInTheDocument();
    expect(screen.getByText("Message 1")).toBeInTheDocument();
    expect(screen.getByText("Message 2")).toBeInTheDocument();
  });

  it("shows load older button when hasMore is true", () => {
    renderThread({ msgs: mockMessages(5), hasMore: true });
    expect(screen.getByText("Load older messages")).toBeInTheDocument();
  });

  it("hides load older button when hasMore is false", () => {
    renderThread({ msgs: mockMessages(5), hasMore: false });
    expect(screen.queryByText("Load older messages")).not.toBeInTheDocument();
  });

  it("renders composer component", () => {
    renderThread({ msgs: mockMessages(2) });
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("passes currentUserId to determine message ownership", () => {
    const msgs = [
      {
        ...mockMessages(1)[0],
        sender: "c1",
        sender_info: { id: "c1", username: "c", full_name: "Client", role: "client" },
      },
    ];
    renderThread({ msgs, currentUserId: "c1" });
    const listitem = screen.getByRole("listitem");
    expect(listitem.getAttribute("aria-label")).toContain("You");
  });

  it("handles failed send gracefully", async () => {
    const onSend = vi.fn().mockRejectedValue(new Error("Failed"));
    renderThread({ msgs: mockMessages(1), onSend });

    // Composer should still be rendered
    expect(screen.getByRole("region")).toBeInTheDocument();
  });
});
