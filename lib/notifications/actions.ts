import type { NotificationItem } from "./types";

export function unreadCount(items: NotificationItem[]): number {
  return items.filter((item) => !item.is_read).length;
}

export function isUnread(item: NotificationItem): boolean {
  return !item.is_read;
}
