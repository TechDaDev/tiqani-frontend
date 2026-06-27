"use client";

import { useEffect, useState } from "react";
import { fetchNotifications } from "@/lib/api/notifications";
import type { NotificationItem } from "@/lib/notifications/types";
import { NotificationList } from "@/components/notifications/notification-list";

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[] | null>(null);

  useEffect(() => {
    fetchNotifications().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <div data-testid="notification-page" className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="mt-1 text-sm text-foreground-muted">In-app updates for reviews, disputes, payments, and system events.</p>
      </div>
      {items ? <NotificationList items={items} /> : <p className="text-sm text-foreground-muted">Loading notifications.</p>}
    </div>
  );
}
