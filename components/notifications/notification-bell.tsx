"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { fetchNotificationUnreadCount } from "@/lib/api/notifications";
import { UnreadCount } from "./unread-count";

export function NotificationBell({ href }: { href: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    fetchNotificationUnreadCount().then((next) => {
      if (active) setCount(next);
    }).catch(() => undefined);
    const id = window.setInterval(() => {
      fetchNotificationUnreadCount().then((next) => {
        if (active) setCount(next);
      }).catch(() => undefined);
    }, 60_000);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, []);

  return (
    <Link href={href} className="inline-flex items-center gap-2">
      <Bell className="h-4 w-4" />
      <UnreadCount count={count} />
    </Link>
  );
}
