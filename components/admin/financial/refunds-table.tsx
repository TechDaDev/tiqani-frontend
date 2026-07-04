import { formatDateTime, formatStatus } from "@/lib/admin/financial/format";
import type { AdminFinancialRefund } from "@/lib/admin/financial/types";
import { FinancialStatusBadge } from "./financial-status-badge";
import { FinancialEmptyState, FinancialTableShell, financialTableBodyClass, financialTableCellClass, financialTableHeadClass, financialTableMonoCellClass, financialTableRowClass } from "./financial-theme";
import { MoneyCell } from "./money-cell";

export function RefundsTable({ items, locale }: { items: AdminFinancialRefund[]; locale: string }) {
  if (items.length === 0) return <FinancialEmptyState />;
  return (
    <FinancialTableShell ariaLabel="Financial refunds">
        <thead className={financialTableHeadClass}>
          <tr><th className="px-3 py-2">Refund</th><th className="px-3 py-2">Contract</th><th className="px-3 py-2">Client</th><th className="px-3 py-2">Technician</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Reason</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Created</th></tr>
        </thead>
        <tbody className={financialTableBodyClass}>
          {items.map((item) => (
            <tr key={item.id} className={financialTableRowClass}>
              <td className={financialTableMonoCellClass}>{item.id.slice(0, 8)}</td>
              <td className={financialTableCellClass}>{item.contractReference || "-"}</td>
              <td className={financialTableCellClass}>{item.client?.name || "-"}</td>
              <td className={financialTableCellClass}>{item.technician?.name || "-"}</td>
              <td className={financialTableCellClass}><MoneyCell amount={item.amount} currency={item.currency} locale={locale} /></td>
              <td className={financialTableCellClass}>{formatStatus(item.sourceType)}</td>
              <td className={financialTableCellClass}><FinancialStatusBadge status={item.status} /></td>
              <td className={financialTableCellClass}>{formatDateTime(item.createdAt, locale)}</td>
            </tr>
          ))}
        </tbody>
    </FinancialTableShell>
  );
}
