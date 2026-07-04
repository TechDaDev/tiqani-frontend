import { formatDateTime, formatStatus } from "@/lib/admin/financial/format";
import type { AdminFinancialAuditEvent } from "@/lib/admin/financial/types";

export function FinancialAuditTable({ items, locale }: { items: AdminFinancialAuditEvent[]; locale: string }) {
  if (items.length === 0) return <p className="text-sm text-gray-500">No financial activity yet.</p>;
  return (
    <div className="overflow-x-auto rounded-md border bg-white">
      <table className="min-w-full divide-y text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
          <tr><th className="px-3 py-2">Event</th><th className="px-3 py-2">Actor</th><th className="px-3 py-2">Target</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Reason</th><th className="px-3 py-2">Source</th><th className="px-3 py-2">Time</th></tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-3 py-2">{formatStatus(item.verb)}</td>
              <td className="px-3 py-2">{item.actor?.name || "-"}</td>
              <td className="px-3 py-2">{item.targetType || "-"}</td>
              <td className="px-3 py-2">{item.amount || "-"}</td>
              <td className="px-3 py-2">{item.reason || "-"}</td>
              <td className="px-3 py-2">{item.sourceService || "-"}</td>
              <td className="px-3 py-2">{formatDateTime(item.createdAt, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
