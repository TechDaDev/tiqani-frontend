import { browserClient } from "@/lib/api/browser-client";
import { mapNotificationList, mapNotificationPreferences } from "@/lib/notifications/mappers";
import type { NotificationItem, NotificationPreferences } from "@/lib/notifications/types";

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const data = await browserClient.get("/api/notifications/");
  return mapNotificationList(data);
}

export async function fetchNotificationUnreadCount(): Promise<number> {
  const data = await browserClient.get("/api/notifications/unread-count/");
  return Number(data.unread_count || 0);
}

export async function markNotificationRead(notificationId: string) {
  return browserClient.post(`/api/notifications/${notificationId}/read/`, {});
}

export async function markAllNotificationsRead() {
  return browserClient.post("/api/notifications/read-all/", {});
}

export async function fetchNotificationPreferences(): Promise<NotificationPreferences> {
  const data = await browserClient.get("/api/notification-preferences/");
  return mapNotificationPreferences(data);
}

export async function updateNotificationPreferences(payload: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
  const data = await browserClient.patch("/api/notification-preferences/", payload);
  return mapNotificationPreferences(data);
}
