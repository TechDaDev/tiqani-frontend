import { formatDateTime, formatStatus } from "@/lib/admin/financial/format";
import type { AdminFinancialLedgerEntry } from "@/lib/admin/financial/types";
import { MoneyCell } from "./money-cell";

export function LedgerTable({ items, locale }: { items: AdminFinancialLedgerEntry[]; locale: string }) {
  if (items.length === 0) return <p className="text-sm text-gray-500">No financial activity yet.</p>;
  return (
    <div className="overflow-x-auto rounded-md border bg-white">
      <table className="min-w-full divide-y text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
          <tr><th className="px-3 py-2">Entry</th><th className="px-3 py-2">User</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">Direction</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Source</th><th className="px-3 py-2">Description</th><th className="px-3 py-2">Created</th></tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-3 py-2 font-mono text-xs">{item.id.slice(0, 8)}</td>
              <td className="px-3 py-2">{item.user?.name || "-"}</td>
              <td className="px-3 py-2">{formatStatus(item.transactionType)}</td>
              <td className="px-3 py-2">{formatStatus(item.direction)}</td>
              <td className="px-3 py-2"><MoneyCell amount={item.amount} locale={locale} /></td>
              <td className="px-3 py-2">{item.sourceObject.type}</td>
              <td className="px-3 py-2">{item.description}</td>
              <td className="px-3 py-2">{formatDateTime(item.createdAt, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
