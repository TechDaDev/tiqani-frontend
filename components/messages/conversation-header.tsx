"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ConversationDetail } from "@/lib/messages/types";

interface ConversationHeaderProps {
  conversation: ConversationDetail;
}

export function ConversationHeader({ conversation }: ConversationHeaderProps) {
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

  return (
    <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
      <Link
        href="/messages"
        className="text-gray-500 hover:text-gray-700 p-2 -ml-2"
        aria-label={t("backToList")}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
        {otherUser.profile_image ? (
          <Image
            src={otherUser.profile_image}
            alt={otherUser.full_name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="font-medium text-gray-900 truncate">
          {otherUser.full_name}
        </h2>
        {conversation.service_request_title && (
          <p className="text-xs text-blue-600 truncate">
            {conversation.service_request_title}
          </p>
        )}
      </div>

      {conversation.status && (
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {t(`status.${conversation.status}`)}
        </span>
      )}
    </div>
  );
}
