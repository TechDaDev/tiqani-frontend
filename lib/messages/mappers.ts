/**
 * Messaging domain mappers.
 * Converts snake_case backend responses to camelCase frontend types.
 */

import type {
  Conversation,
  ConversationDetail,
  Message,
  ChatUserSummary,
  LastMessagePreview,
  UnreadSummary,
} from "./types";

export function mapChatUser(raw: Record<string, unknown>): ChatUserSummary {
  return {
    id: String(raw.id ?? ""),
    username: String(raw.username ?? ""),
    full_name: String(raw.full_name ?? raw.username ?? ""),
    profile_image: raw.profile_image ? String(raw.profile_image) : null,
    role: String(raw.role ?? ""),
  };
}

export function mapLastMessagePreview(
  raw: Record<string, unknown> | null | undefined
): LastMessagePreview | null {
  if (!raw) return null;
  return {
    id: String(raw.id ?? ""),
    message_type: String(raw.message_type ?? "TEXT") as LastMessagePreview["message_type"],
    preview: String(raw.preview ?? ""),
    sender_id: String(raw.sender_id ?? ""),
    created_at: String(raw.created_at ?? ""),
  };
}

export function mapConversation(raw: Record<string, unknown>): Conversation {
  return {
    id: String(raw.id ?? ""),
    status: String(raw.status ?? "OPEN") as Conversation["status"],
    client_user: mapChatUser((raw.client_user as Record<string, unknown>) ?? {}),
    technician_user: mapChatUser(
      (raw.technician_user as Record<string, unknown>) ?? {}
    ),
    linked_contract_id: raw.linked_contract_id
      ? String(raw.linked_contract_id)
      : null,
    service_request_id: raw.service_request_id
      ? String(raw.service_request_id)
      : null,
    service_request_title: raw.service_request_title
      ? String(raw.service_request_title)
      : null,
    last_message_preview: mapLastMessagePreview(
      raw.last_message_preview as Record<string, unknown> | null
    ),
    unread_count: Number(raw.unread_count ?? 0),
    last_message_at: raw.last_message_at ? String(raw.last_message_at) : null,
    created_at: String(raw.created_at ?? ""),
    updated_at: String(raw.updated_at ?? ""),
  };
}

export function mapConversationDetail(
  raw: Record<string, unknown>
): ConversationDetail {
  return {
    id: String(raw.id ?? ""),
    client_id: String(raw.client_id ?? ""),
    technician_id: String(raw.technician_id ?? ""),
    client_user: mapChatUser((raw.client_user as Record<string, unknown>) ?? {}),
    technician_user: mapChatUser(
      (raw.technician_user as Record<string, unknown>) ?? {}
    ),
    created_by_id: String(raw.created_by_id ?? ""),
    linked_contract_id: raw.linked_contract_id
      ? String(raw.linked_contract_id)
      : null,
    linked_contract_status: raw.linked_contract_status
      ? String(raw.linked_contract_status)
      : null,
    service_request_id: raw.service_request_id
      ? String(raw.service_request_id)
      : null,
    service_request_title: raw.service_request_title
      ? String(raw.service_request_title)
      : null,
    service_request_status: raw.service_request_status
      ? String(raw.service_request_status)
      : null,
    status: String(raw.status ?? "OPEN") as ConversationDetail["status"],
    metadata: (raw.metadata as Record<string, unknown>) ?? {},
    last_message: raw.last_message
      ? mapMessage(raw.last_message as Record<string, unknown>)
      : null,
    unread_count: Number(raw.unread_count ?? 0),
    last_message_at: raw.last_message_at ? String(raw.last_message_at) : null,
    created_at: String(raw.created_at ?? ""),
    updated_at: String(raw.updated_at ?? ""),
    closed_at: raw.closed_at ? String(raw.closed_at) : null,
    closed_by_id: raw.closed_by_id ? String(raw.closed_by_id) : null,
  };
}

export function mapMessage(raw: Record<string, unknown>): Message {
  return {
    id: String(raw.id ?? ""),
    room_id: String(raw.room_id ?? ""),
    sender: String(raw.sender ?? ""),
    sender_info: mapChatUser(
      (raw.sender_info as Record<string, unknown>) ?? {}
    ),
    message_type: String(raw.message_type ?? "TEXT") as Message["message_type"],
    body: String(raw.body ?? ""),
    safe_body: String(raw.safe_body ?? raw.body ?? ""),
    attachment: raw.attachment ? String(raw.attachment) : null,
    attachment_name: String(raw.attachment_name ?? ""),
    attachment_size: raw.attachment_size ? Number(raw.attachment_size) : null,
    attachment_content_type: String(raw.attachment_content_type ?? ""),
    price_amount: raw.price_amount ? String(raw.price_amount) : null,
    price_currency: String(raw.price_currency ?? "IQD"),
    metadata: (raw.metadata as Record<string, unknown>) ?? {},
    is_deleted: Boolean(raw.is_deleted ?? false),
    edited_at: raw.edited_at ? String(raw.edited_at) : null,
    created_at: String(raw.created_at ?? ""),
    updated_at: String(raw.updated_at ?? ""),
  };
}

export function mapUnreadSummary(raw: Record<string, unknown>): UnreadSummary {
  return {
    total_unread: Number(raw.total_unread ?? 0),
    rooms: Array.isArray(raw.rooms)
      ? (raw.rooms as Array<Record<string, unknown>>).map((r) => ({
          room_id: String(r.room_id ?? ""),
          unread_count: Number(r.unread_count ?? 0),
        }))
      : [],
  };
}
