"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { UnreadBadge } from "./unread-badge";
import type { Conversation } from "@/lib/messages/types";

interface ConversationListItemProps {
  conversation: Conversation;
}

export function ConversationListItem({ conversation }: ConversationListItemProps) {
  const t = useTranslations("conversations");

  const otherUser =
    conversation.client_user.role === "client"
      ? conversation.technician_user
      : conversation.client_user;

  const initials = otherUser.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const lastMessagePreview = conversation.last_message_preview?.preview ?? t("noMessages");
  const lastMessageTime = conversation.last_message_at
    ? new Date(conversation.last_message_at).toLocaleDateString()
    : "";

  return (
    <Link
      href={`/messages/${conversation.id}`}
      className="flex items-center gap-3 p-4 border-b border-border-warm hover:bg-surface-warm/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      aria-label={`${t("conversationWith")} ${otherUser.full_name}`}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
        {otherUser.profile_image ? (
          <Image
            src={otherUser.profile_image}
            alt={otherUser.full_name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground truncate">
            {otherUser.full_name}
          </h3>
          {lastMessageTime && (
            <span className="text-xs text-foreground-muted flex-shrink-0">
              {lastMessageTime}
            </span>
          )}
        </div>

        {conversation.service_request_title && (
          <p className="text-xs text-blue-600 truncate">
            {conversation.service_request_title}
          </p>
        )}

        <p className="text-sm text-foreground-muted/80 truncate mt-0.5">
          {lastMessagePreview}
        </p>
      </div>

      {conversation.unread_count > 0 && (
        <div className="flex-shrink-0">
          <UnreadBadge count={conversation.unread_count} />
        </div>
      )}
    </Link>
  );
}
