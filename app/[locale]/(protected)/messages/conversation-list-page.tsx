"use client";

import { useTranslations } from "next-intl";
import { ConversationList } from "@/components/messages/conversation-list";
import { useAuth } from "@/components/auth/auth-provider";

export default function ConversationListPage() {
  const t = useTranslations("conversations");
  const { user } = useAuth();

  if (user && user.role !== "client" && user.role !== "technician") {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-6 text-sm text-foreground-muted">
        Messages are available only for client/technician conversations.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card">
      <div className="sticky top-0 z-10 border-b border-border bg-card px-4 py-3">
        <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
      </div>
      <ConversationList />
    </div>
  );
}
