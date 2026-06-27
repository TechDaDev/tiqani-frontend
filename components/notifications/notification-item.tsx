"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import type { NotificationItem as Item } from "@/lib/notifications/types";
import { markNotificationRead } from "@/lib/api/notifications";

export function NotificationItem({ item, onRead }: { item: Item; onRead: (id: string) => void }) {
  async function handleRead() {
    await markNotificationRead(item.id);
    onRead(item.id);
  }

  return (
    <article data-testid={`notification-item-${item.id}`} className="flex gap-3 rounded-lg border border-border bg-card p-4">
      <Bell className="mt-1 h-5 w-5 text-primary" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-medium">{item.title}</h3>
            {item.message && <p className="mt-1 text-sm text-foreground-muted">{item.message}</p>}
          </div>
          {!item.is_read && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">Unread</span>}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.target_url && (
            <Link href={item.target_url} className="text-sm font-medium text-primary">
              Open
            </Link>
          )}
          {!item.is_read && (
            <button type="button" data-testid="notification-mark-read" onClick={handleRead} className="text-sm font-medium text-primary">
              Mark read
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
