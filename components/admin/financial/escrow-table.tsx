import { formatDateTime } from "@/lib/admin/financial/format";
import type { AdminFinancialEscrow } from "@/lib/admin/financial/types";
import { FinancialStatusBadge } from "./financial-status-badge";
import { MoneyCell } from "./money-cell";

export function EscrowTable({ items, locale }: { items: AdminFinancialEscrow[]; locale: string }) {
  if (items.length === 0) return <p className="text-sm text-gray-500">No financial activity yet.</p>;
  return (
    <div className="overflow-x-auto rounded-md border bg-white">
      <table className="min-w-full divide-y text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
          <tr><th className="px-3 py-2">Contract</th><th className="px-3 py-2">Client</th><th className="px-3 py-2">Technician</th><th className="px-3 py-2">Escrow</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Dispute</th><th className="px-3 py-2">Refund</th><th className="px-3 py-2">Settled</th></tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-3 py-2">{item.contractReference || item.contract.slice(0, 8)}</td>
              <td className="px-3 py-2">{item.client?.name || "-"}</td>
              <td className="px-3 py-2">{item.technician?.name || "-"}</td>
              <td className="px-3 py-2"><MoneyCell amount={item.escrowAmount} currency={item.currency} locale={locale} /></td>
              <td className="px-3 py-2"><FinancialStatusBadge status={item.status} /></td>
              <td className="px-3 py-2">{item.disputeState || "-"}</td>
              <td className="px-3 py-2">{item.refundState || "-"}</td>
              <td className="px-3 py-2">{formatDateTime(item.settledAt, locale) || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
