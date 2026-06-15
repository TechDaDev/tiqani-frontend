"use client";

import { useTranslations } from "next-intl";
import { ConversationList } from "@/components/messages/conversation-list";

export default function ConversationListPage() {
  const t = useTranslations("conversations");

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-white border-x border-gray-200">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-semibold text-gray-900">{t("title")}</h1>
      </div>
      <ConversationList />
    </div>
  );
}
