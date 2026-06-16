"use client";

import { useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { MessageBubble } from "./message-bubble";
import { MessageComposer } from "./message-composer";
import type { Message, ConversationDetail } from "@/lib/messages/types";

interface MessageThreadProps {
  conversation: ConversationDetail;
  messages: Message[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadOlder: () => void;
  onSend: (body: string) => Promise<void>;
  isSending: boolean;
  currentUserId?: string;
}

export function MessageThread({
  conversation,
  messages,
  isLoading,
  hasMore,
  onLoadOlder,
  onSend,
  isSending,
  currentUserId,
}: MessageThreadProps) {
  const t = useTranslations("messages");
  const threadRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);

  const scrollToBottom = useCallback((smooth = false) => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    }
  }, []);

  // Scroll to bottom on initial load or new messages
  useEffect(() => {
    if (messages && messages.length > prevMessagesLengthRef.current) {
      const isNewMessage = messages.length === prevMessagesLengthRef.current + 1;
      scrollToBottom(isNewMessage);
    }
    prevMessagesLengthRef.current = messages?.length ?? 0;
  }, [messages, scrollToBottom]);

  if (isLoading && !messages) {
    return (
      <div className="flex-1 flex items-center justify-center" role="status">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-foreground-muted">{t("empty")}</p>
        </div>
        <MessageComposer onSend={onSend} isPending={isSending} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div
        ref={threadRef}
        className="flex-1 overflow-y-auto p-4 space-y-1"
        role="list"
        aria-label={t("messageList")}
      >
        {hasMore && (
          <div className="text-center py-2">
            <button
              onClick={onLoadOlder}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
              aria-label={t("loadOlder")}
            >
              {isLoading ? t("loading") : t("loadOlder")}
            </button>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
          isOwn={currentUserId ? msg.sender === currentUserId : false}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      <MessageComposer onSend={onSend} isPending={isSending} />
    </div>
  );
}
