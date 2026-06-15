import { Metadata } from "next";
import ConversationListPage from "./conversation-list-page";

export const metadata: Metadata = {
  title: "Messages",
};

export default function Page() {
  return <ConversationListPage />;
}
