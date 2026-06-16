/**
 * Tests for MessageComposer component.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MessageComposer } from "@/components/messages/message-composer";
import { NextIntlClientProvider } from "next-intl";

const messages = {
  messageComposer: {
    composerLabel: "Message composer",
    placeholder: "Type a message...",
    messageInput: "Type your message",
    send: "Send",
  },
};

function renderComposer(onSend = vi.fn(), isPending = false) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <MessageComposer onSend={onSend} isPending={isPending} />
    </NextIntlClientProvider>
  );
}

describe("MessageComposer", () => {
  it("renders textarea", () => {
    renderComposer();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders send button", () => {
    renderComposer();
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("disables button when text is empty", () => {
    renderComposer();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("enables button when text is entered", () => {
    renderComposer();
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    expect(screen.getByRole("button", { name: "Send" })).not.toBeDisabled();
  });

  it("calls onSend on button click", async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    renderComposer(onSend);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(onSend).toHaveBeenCalledWith("Hello");
  });

  it("calls onSend on Enter key", async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    renderComposer(onSend);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(onSend).toHaveBeenCalledWith("Hello");
  });

  it("does not call onSend on Shift+Enter", () => {
    const onSend = vi.fn();
    renderComposer(onSend);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not send empty message", () => {
    const onSend = vi.fn();
    renderComposer(onSend);

    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not send whitespace-only message", () => {
    const onSend = vi.fn();
    renderComposer(onSend);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(onSend).not.toHaveBeenCalled();
  });

  it("prevents duplicate submit while pending", () => {
    const onSend = vi.fn();
    renderComposer(onSend, true);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("restores text on send failure", async () => {
    const onSend = vi.fn().mockRejectedValue(new Error("Failed"));
    renderComposer(onSend);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    // Wait for async rejection - use a short delay
    await vi.waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue("Hello");
    }, { timeout: 2000 });
  });

  it("shows character counter after typing", () => {
    renderComposer();
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Hello" } });

    // Character counter should appear with remaining chars
    expect(screen.getByText("1995")).toBeInTheDocument();
  });

  it("shows negative counter when over limit", () => {
    renderComposer();
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "x".repeat(2001) } });

    expect(screen.getByText("-1")).toBeInTheDocument();
  });

  it("disables send when over character limit", () => {
    renderComposer();
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "x".repeat(2001) } });

    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("has accessible region label", () => {
    renderComposer();
    expect(screen.getByRole("region")).toHaveAttribute("aria-label", "Message composer");
  });

  it("disables textarea while pending", () => {
    renderComposer(vi.fn(), true);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
