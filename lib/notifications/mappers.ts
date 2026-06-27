import type { NotificationItem, NotificationPreferences } from "./types";

const PRIVATE_KEYS = ["email", "phone", "wallet", "wallet_id", "provider", "token", "secret"];

function safeMetadata(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") return {};
  const result = { ...(raw as Record<string, unknown>) };
  for (const key of Object.keys(result)) {
    if (PRIVATE_KEYS.some((privateKey) => key.toLowerCase().includes(privateKey))) {
      delete result[key];
    }
  }
  return result;
}

export function safeNotificationTargetUrl(url: string): string {
  if (!url || !url.startsWith("/")) return "/notifications";
  if (url.startsWith("//") || url.includes("://")) return "/notifications";
  return url;
}

export function mapNotification(raw: Record<string, unknown>): NotificationItem {
  return {
    id: String(raw.id || ""),
    notification_type: String(raw.notification_type || ""),
    title: String(raw.title || ""),
    message: String(raw.message || ""),
    actor: raw.actor ? String(raw.actor) : null,
    actor_name: raw.actor_name ? String(raw.actor_name) : null,
    target_type: String(raw.target_type || ""),
    target_id: raw.target_id ? String(raw.target_id) : null,
    target_url: safeNotificationTargetUrl(String(raw.target_url || "")),
    title_key: String(raw.title_key || ""),
    body_key: String(raw.body_key || ""),
    metadata: safeMetadata(raw.metadata),
    is_read: Boolean(raw.is_read),
    read_at: raw.read_at ? String(raw.read_at) : null,
    created_at: String(raw.created_at || ""),
  };
}

export function mapNotificationList(raw: unknown): NotificationItem[] {
  const items = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as Record<string, unknown>)?.results)
      ? ((raw as Record<string, unknown>).results as unknown[])
      : [];
  return items.map((item) => mapNotification(item as Record<string, unknown>));
}

export function mapNotificationPreferences(raw: Record<string, unknown>): NotificationPreferences {
  return {
    offers: Boolean(raw.offers),
    contracts: Boolean(raw.contracts),
    payments: Boolean(raw.payments),
    execution: Boolean(raw.execution),
    messages: Boolean(raw.messages),
    disputes: Boolean(raw.disputes),
    refunds: Boolean(raw.refunds),
    reviews: Boolean(raw.reviews),
    security: Boolean(raw.security),
    system: Boolean(raw.system),
    email_enabled: Boolean(raw.email_enabled),
    push_enabled: Boolean(raw.push_enabled),
    created_at: raw.created_at ? String(raw.created_at) : undefined,
    updated_at: raw.updated_at ? String(raw.updated_at) : undefined,
  };
}
