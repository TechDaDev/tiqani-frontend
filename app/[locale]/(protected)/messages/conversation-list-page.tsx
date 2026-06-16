"use client";

import { useTranslations } from "next-intl";
import { ConversationList } from "@/components/messages/conversation-list";

export default function ConversationListPage() {
  const t = useTranslations("conversations");

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-surface-pure border-x border-border-warm">
      <div className="sticky top-0 z-10 bg-surface-pure border-b border-border-warm px-4 py-3">
        <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
      </div>
      <ConversationList />
    </div>
  );
}
