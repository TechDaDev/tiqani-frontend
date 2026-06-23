import type { DisputeAuditEvent } from "@/lib/disputes/types";

interface Props {
  auditEvents: DisputeAuditEvent[];
}

export function DisputeTimeline({ auditEvents }: Props) {
  if (!auditEvents || auditEvents.length === 0) return null;

  return (
    <div className="space-y-2">
      {auditEvents.map((event) => (
        <div key={event.id} className="flex gap-3 items-start">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">{new Date(event.created_at).toLocaleString()}</p>
            <p className="text-sm font-medium">{event.event_type}</p>
            {event.actor_name && (
              <p className="text-xs text-gray-500">by {event.actor_name}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
