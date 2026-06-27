"use client";

import { useEffect, useState } from "react";
import { fetchNotificationPreferences } from "@/lib/api/notifications";
import type { NotificationPreferences as Preferences } from "@/lib/notifications/types";
import { NotificationPreferences } from "@/components/notifications/notification-preferences";

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  useEffect(() => {
    fetchNotificationPreferences().then(setPreferences).catch(() => setPreferences(null));
  }, []);

  return (
    <div data-testid="notification-settings-page" className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Notification Preferences</h1>
        <p className="mt-1 text-sm text-foreground-muted">Control in-app notification categories.</p>
      </div>
      {preferences ? <NotificationPreferences preferences={preferences} /> : <p className="text-sm text-foreground-muted">Loading preferences.</p>}
    </div>
  );
}
