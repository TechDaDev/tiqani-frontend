import { formatDateTime } from "@/lib/admin/financial/format";
import type { AdminFinancialPayment } from "@/lib/admin/financial/types";
import { FinancialStatusBadge } from "./financial-status-badge";
import { MoneyCell } from "./money-cell";

export function PaymentsTable({ items, locale }: { items: AdminFinancialPayment[]; locale: string }) {
  if (items.length === 0) return <p className="text-sm text-gray-500">No financial activity yet.</p>;
  return (
    <div className="overflow-x-auto rounded-md border bg-white">
      <table className="min-w-full divide-y text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
          <tr><th className="px-3 py-2">Reference</th><th className="px-3 py-2">Payer</th><th className="px-3 py-2">Contract</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Provider</th><th className="px-3 py-2">Created</th></tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-3 py-2 font-mono text-xs">{item.id.slice(0, 8)}</td>
              <td className="px-3 py-2">{item.payer?.name || "-"}</td>
              <td className="px-3 py-2">{item.contractReference || "-"}</td>
              <td className="px-3 py-2"><MoneyCell amount={item.amount} currency={item.currency} locale={locale} /></td>
              <td className="px-3 py-2"><FinancialStatusBadge status={item.status} /></td>
              <td className="px-3 py-2">{item.provider} {item.providerReferenceMasked}</td>
              <td className="px-3 py-2">{formatDateTime(item.createdAt, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
