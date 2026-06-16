"use client";

import { useTranslations } from "next-intl";
import type { Message } from "@/lib/messages/types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const t = useTranslations("messages");

  const time = message.created_at
    ? new Date(message.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const date = message.created_at
    ? new Date(message.created_at).toLocaleDateString()
    : "";

  if (message.message_type === "SYSTEM") {
    return (
      <div className="flex justify-center my-2" role="status">
        <span className="text-xs text-foreground-muted bg-surface-warm px-3 py-1 rounded-full">
          {message.safe_body || message.body}
        </span>
      </div>
    );
  }

  if (message.is_deleted) {
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"} my-1`}>
        <div className="px-4 py-2 rounded-lg bg-surface-warm text-neutral-soft text-sm italic">
          {t("deleted")}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} my-1`}
      role="listitem"
      aria-label={`${isOwn ? t("you") : message.sender_info.full_name}: ${message.safe_body}`}
    >
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
          isOwn
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-surface-warm text-foreground rounded-bl-md"
        }`}
      >
        {message.message_type === "FILE" && (
          <p className="text-sm underline">{message.attachment_name}</p>
        )}
        {message.message_type === "PRICE_OFFER" && (
          <p className="text-sm font-semibold">
            {t("priceOffer")}: {message.price_amount} {message.price_currency}
          </p>
        )}
        {message.safe_body && (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.safe_body}
          </p>
        )}
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
          <span className={`text-xs ${isOwn ? "text-blue-200" : "text-neutral-soft"}`}>
            {time}
          </span>
          {isOwn && (
            <span className="text-xs text-blue-200" title={date}>
              ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
