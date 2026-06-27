"use client";

import { useState } from "react";
import type { NotificationItem as Item } from "@/lib/notifications/types";
import { markAllNotificationsRead } from "@/lib/api/notifications";
import { NotificationItem } from "./notification-item";

export function NotificationList({ items }: { items: Item[] }) {
  const [notifications, setNotifications] = useState(items);
  const unread = notifications.filter((item) => !item.is_read).length;

  async function handleRead(id: string) {
    setNotifications((current) => current.map((item) => item.id === id ? { ...item, is_read: true } : item));
  }

  async function handleReadAll() {
    await markAllNotificationsRead();
    setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
  }

  if (notifications.length === 0) {
    return <p className="rounded-lg border border-border p-6 text-sm text-foreground-muted">No notifications.</p>;
  }

  return (
    <div data-testid="notification-list" className="space-y-3">
      <div className="flex items-center justify-between gap-3" aria-live="polite">
        <p className="text-sm text-foreground-muted">{unread} unread</p>
        <button type="button" data-testid="notification-mark-all" onClick={handleReadAll} className="rounded-md border border-border px-3 py-1.5 text-sm">
          Mark all read
        </button>
      </div>
      {notifications.map((item) => <NotificationItem key={item.id} item={item} onRead={handleRead} />)}
    </div>
  );
}
