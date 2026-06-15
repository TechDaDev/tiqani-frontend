import { Metadata } from "next";
import ConversationDetailPage from "./conversation-detail-page";

export const metadata: Metadata = {
  title: "Conversation",
};

export default async function Page({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  return <ConversationDetailPage conversationId={conversationId} />;
}
