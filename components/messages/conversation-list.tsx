"use client";

import { useConversations } from "@/lib/messages/query";
import { ConversationListItem } from "./conversation-list-item";
import { useTranslations } from "next-intl";

export function ConversationList() {
  const t = useTranslations("conversations");
  const { data: conversations, isLoading, error, refetch } = useConversations();

  if (isLoading) {
    return (
      <div className="space-y-4 p-4" role="status" aria-label={t("loading")}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center" role="alert">
        <p className="text-red-600 mb-4">{t("error")}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={t("retry")}
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 text-lg">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200" role="list" aria-label={t("conversationList")}>
      {conversations.map((conv) => (
        <ConversationListItem key={conv.id} conversation={conv} />
      ))}
    </div>
  );
}
