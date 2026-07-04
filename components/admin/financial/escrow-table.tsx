import { formatDateTime } from "@/lib/admin/financial/format";
import type { AdminFinancialEscrow } from "@/lib/admin/financial/types";
import { FinancialStatusBadge } from "./financial-status-badge";
import { FinancialEmptyState, FinancialTableShell, financialTableBodyClass, financialTableCellClass, financialTableHeadClass, financialTableRowClass } from "./financial-theme";
import { MoneyCell } from "./money-cell";

export function EscrowTable({ items, locale }: { items: AdminFinancialEscrow[]; locale: string }) {
  if (items.length === 0) return <FinancialEmptyState />;
  return (
    <FinancialTableShell ariaLabel="Financial escrow">
        <thead className={financialTableHeadClass}>
          <tr><th className="px-3 py-2">Contract</th><th className="px-3 py-2">Client</th><th className="px-3 py-2">Technician</th><th className="px-3 py-2">Escrow</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Dispute</th><th className="px-3 py-2">Refund</th><th className="px-3 py-2">Settled</th></tr>
        </thead>
        <tbody className={financialTableBodyClass}>
          {items.map((item) => (
            <tr key={item.id} className={financialTableRowClass}>
              <td className={financialTableCellClass}>{item.contractReference || item.contract.slice(0, 8)}</td>
              <td className={financialTableCellClass}>{item.client?.name || "-"}</td>
              <td className={financialTableCellClass}>{item.technician?.name || "-"}</td>
              <td className={financialTableCellClass}><MoneyCell amount={item.escrowAmount} currency={item.currency} locale={locale} /></td>
              <td className={financialTableCellClass}><FinancialStatusBadge status={item.status} /></td>
              <td className={financialTableCellClass}>{item.disputeState || "-"}</td>
              <td className={financialTableCellClass}>{item.refundState || "-"}</td>
              <td className={financialTableCellClass}>{formatDateTime(item.settledAt, locale) || "-"}</td>
            </tr>
          ))}
        </tbody>
    </FinancialTableShell>
  );
}
