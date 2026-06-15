/**
 * Messaging domain types.
 * Mirrors backend ServiceChatRoom/ServiceChatMessage models.
 */

export type RoomStatus =
  | "OPEN"
  | "PROPOSAL_CREATED"
  | "CONTRACT_LINKED"
  | "CLOSED"
  | "BLOCKED";

export type MessageType =
  | "TEXT"
  | "FILE"
  | "SYSTEM"
  | "PRICE_OFFER"
  | "PRICE_ACCEPTED"
  | "CONTRACT_LINKED";

export interface ChatUserSummary {
  id: string;
  username: string;
  full_name: string;
  profile_image?: string | null;
  role: string;
}

export interface LastMessagePreview {
  id: string;
  message_type: MessageType;
  preview: string;
  sender_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  status: RoomStatus;
  client_user: ChatUserSummary;
  technician_user: ChatUserSummary;
  linked_contract_id?: string | null;
  service_request_id?: string | null;
  service_request_title?: string | null;
  last_message_preview?: LastMessagePreview | null;
  unread_count: number;
  last_message_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail {
  id: string;
  client_id: string;
  technician_id: string;
  client_user: ChatUserSummary;
  technician_user: ChatUserSummary;
  created_by_id: string;
  linked_contract_id?: string | null;
  linked_contract_status?: string | null;
  service_request_id?: string | null;
  service_request_title?: string | null;
  service_request_status?: string | null;
  status: RoomStatus;
  metadata: Record<string, unknown>;
  last_message?: Message | null;
  unread_count: number;
  last_message_at?: string | null;
  created_at: string;
  updated_at: string;
  closed_at?: string | null;
  closed_by_id?: string | null;
}

export interface Message {
  id: string;
  room_id: string;
  sender: string;
  sender_info: ChatUserSummary;
  message_type: MessageType;
  body: string;
  safe_body: string;
  attachment?: string | null;
  attachment_name?: string;
  attachment_size?: number | null;
  attachment_content_type?: string;
  price_amount?: string | null;
  price_currency?: string;
  metadata: Record<string, unknown>;
  is_deleted: boolean;
  edited_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UnreadSummary {
  total_unread: number;
  rooms: Array<{
    room_id: string;
    unread_count: number;
  }>;
}

export interface SendMessagePayload {
  body: string;
}
