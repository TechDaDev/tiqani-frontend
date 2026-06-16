/**
 * Tests for MessageBubble component.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MessageBubble } from "@/components/messages/message-bubble";
import type { Message } from "@/lib/messages/types";
import { NextIntlClientProvider } from "next-intl";

const messages = {
  messages: {
    you: "You",
    deleted: "This message was deleted.",
    priceOffer: "Price offer",
  },
};

function renderBubble(message: Partial<Message>, isOwn: boolean) {
  const full: Message = {
    id: "msg-1",
    room_id: "room-1",
    sender: isOwn ? "me" : "other",
    sender_info: {
      id: isOwn ? "me" : "other",
      username: isOwn ? "me" : "other",
      full_name: isOwn ? "Me" : "Other Person",
      role: isOwn ? "client" : "technician",
    },
    message_type: "TEXT",
    body: "Test message body",
    safe_body: "Test message body",
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
    ...message,
  };

  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <MessageBubble message={full} isOwn={isOwn} />
    </NextIntlClientProvider>
  );
}

describe("MessageBubble", () => {
  it("renders own message right-aligned", () => {
    const { container } = renderBubble({}, true);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("justify-end");
  });

  it("renders other message left-aligned", () => {
    const { container } = renderBubble({}, false);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("justify-start");
  });

  it("renders own message with blue background", () => {
    renderBubble({}, true);
    const bubble = screen.getByText("Test message body").closest("div[class*='max-w-']");
    expect(bubble?.className).toContain("bg-blue-600");
  });

  it("renders other message with warm background", () => {
    renderBubble({}, false);
    const bubble = screen.getByText("Test message body").closest("div[class*='max-w-']");
    expect(bubble?.className).toContain("bg-surface-warm");
  });

  it("renders safe_body text", () => {
    renderBubble({ safe_body: "Hello there" }, false);
    expect(screen.getByText("Hello there")).toBeInTheDocument();
  });

  it("renders SYSTEM message centered", () => {
    const { container } = renderBubble({ message_type: "SYSTEM", body: "Room created", safe_body: "Room created" }, false);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("justify-center");
  });

  it("renders deleted message", () => {
    renderBubble({ is_deleted: true }, true);
    expect(screen.getByText("This message was deleted.")).toBeInTheDocument();
  });

  it("renders PRICE_OFFER message", () => {
    renderBubble({ message_type: "PRICE_OFFER", price_amount: "50000" }, false);
    expect(screen.getByText(/50000/)).toBeInTheDocument();
  });

  it("renders FILE message with filename", () => {
    renderBubble({ message_type: "FILE", attachment_name: "document.pdf" }, false);
    expect(screen.getByText("document.pdf")).toBeInTheDocument();
  });

  it("renders accessible label with sender name", () => {
    renderBubble({ safe_body: "Hello" }, false);
    const item = screen.getByRole("listitem");
    expect(item.getAttribute("aria-label")).toContain("Other Person");
  });

  it("renders accessible label with You for own message", () => {
    renderBubble({ safe_body: "Hello" }, true);
    const item = screen.getByRole("listitem");
    expect(item.getAttribute("aria-label")).toContain("You");
  });

  it("displays timestamp", () => {
    renderBubble({}, false);
    // The timestamp format depends on the runtime locale — just check it renders
    const timeEl = screen.queryByText(/10:00/);
    const amPmEl = screen.queryByText(/AM|PM/);
    expect(timeEl || amPmEl).toBeTruthy();
  });

  it("wraps long messages", () => {
    const longBody = "A".repeat(500);
    renderBubble({ safe_body: longBody }, false);
    const text = screen.getByText(longBody);
    expect(text.className).toContain("break-words");
  });

  it("renders message without HTML rendering", () => {
    renderBubble({ safe_body: "<script>alert('xss')</script>" }, false);
    expect(screen.getByText("<script>alert('xss')</script>")).toBeInTheDocument();
  });
});
