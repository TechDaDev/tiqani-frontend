"use client";

import { useEffect, useState } from "react";
import { fetchAuditEvents } from "@/lib/admin/api";
import type { AdminAuditEvent } from "@/lib/admin/types";

export default function AdminAuditPage() {
  const [events, setEvents] = useState<AdminAuditEvent[]>([]);

  useEffect(() => {
    fetchAuditEvents().then((data) => setEvents(data.results)).catch(() => setEvents([]));
  }, []);

  return (
    <div className="space-y-5" data-testid="admin-audit-page">
      <h1 className="text-2xl font-semibold">Audit Trail</h1>
      <div className="space-y-3">
        {events.map((event) => (
          <article key={event.id} className="rounded-lg border border-border p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <h2 className="font-medium">{event.verb}</h2>
              <time className="text-sm text-foreground-muted">{event.createdAt}</time>
            </div>
            <p className="mt-1 text-sm text-foreground-muted">
              {event.actorName || "system"} on {event.targetType || "system"} {event.targetRepr}
            </p>
            {event.metadata.reason ? <p className="mt-2 text-sm">Reason: {String(event.metadata.reason)}</p> : null}
          </article>
        ))}
        {events.length === 0 && <p className="rounded-lg border border-border p-4 text-sm">No audit events.</p>}
      </div>
    </div>
  );
}
