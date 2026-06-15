"use client";

import { useTranslations } from "next-intl";
import {
  useConversationDetail,
  useMessages,
  useSendMessage,
  useMarkRead,
} from "@/lib/messages/query";
import { ConversationHeader } from "@/components/messages/conversation-header";
import { MessageThread } from "@/components/messages/message-thread";
import { useEffect, useState } from "react";
import { browserRequest } from "@/lib/api/browser-client";

interface ConversationDetailPageProps {
  conversationId: string;
}

export default function ConversationDetailPage({
  conversationId,
}: ConversationDetailPageProps) {
  const t = useTranslations("messages");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch current user ID from auth/me
  useEffect(() => {
    browserRequest<Record<string, unknown>>("/api/auth/me/")
      .then((data) => {
        if (data?.id) setCurrentUserId(String(data.id));
      })
      .catch(() => {});
  }, []);

  const {
    data: conversation,
    isLoading: convLoading,
    error: convError,
    refetch: refetchConv,
  } = useConversationDetail(conversationId);

  const {
    data: messages,
    isLoading: msgsLoading,
    hasMore,
    loadOlder,
  } = useMessages(conversationId);

  const { mutate: sendMessage, isPending: isSending } =
    useSendMessage(conversationId);
  const { mutate: markRead } = useMarkRead(conversationId);

  // Mark as read when conversation loads
  useEffect(() => {
    if (conversation && conversation.unread_count > 0) {
      markRead();
    }
  }, [conversation?.id, conversation?.unread_count, markRead]);

  if (convLoading) {
    return (
      <div className="max-w-2xl mx-auto min-h-screen bg-white border-x border-gray-200 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" role="status" />
      </div>
    );
  }

  if (convError || !conversation) {
    return (
      <div className="max-w-2xl mx-auto min-h-screen bg-white border-x border-gray-200 flex items-center justify-center">
        <div className="text-center" role="alert">
          <p className="text-red-600 mb-4">{t("error")}</p>
          <button
            onClick={refetchConv}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-white border-x border-gray-200 flex flex-col">
      <ConversationHeader conversation={conversation} />
      <MessageThread
        conversation={conversation}
        messages={messages ?? []}
        isLoading={msgsLoading}
        hasMore={hasMore}
        onLoadOlder={loadOlder}
        onSend={async (body) => {
          await sendMessage({ body });
        }}
        isSending={isSending}
        currentUserId={currentUserId ?? undefined}
      />
    </div>
  );
}
