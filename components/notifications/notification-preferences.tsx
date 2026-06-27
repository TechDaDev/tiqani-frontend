"use client";

import { useState } from "react";
import type { NotificationPreferences as Preferences } from "@/lib/notifications/types";
import { updateNotificationPreferences } from "@/lib/api/notifications";

const fields: Array<keyof Preferences> = [
  "offers", "contracts", "payments", "execution", "messages",
  "disputes", "refunds", "reviews", "security", "system",
];

export function NotificationPreferences({ preferences }: { preferences: Preferences }) {
  const [value, setValue] = useState(preferences);
  const [saving, setSaving] = useState(false);

  async function toggle(field: keyof Preferences) {
    const next = { ...value, [field]: !value[field] };
    setValue(next);
    setSaving(true);
    try {
      setValue(await updateNotificationPreferences({ [field]: next[field] }));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div data-testid="notification-preferences" className="space-y-3" aria-busy={saving}>
      {fields.map((field) => (
        <label key={field} className="flex items-center justify-between rounded-lg border border-border p-3">
          <span className="capitalize">{field}</span>
          <input
            type="checkbox"
            data-testid={`notification-pref-${field}`}
            checked={Boolean(value[field])}
            onChange={() => toggle(field)}
            className="h-5 w-5"
          />
        </label>
      ))}
      <p className="text-sm text-foreground-muted">Email and push delivery are deferred; these toggles control in-app notifications.</p>
    </div>
  );
}
