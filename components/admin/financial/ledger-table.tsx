import { formatDateTime, formatStatus } from "@/lib/admin/financial/format";
import type { AdminFinancialLedgerEntry } from "@/lib/admin/financial/types";
import { FinancialEmptyState, FinancialTableShell, financialTableBodyClass, financialTableCellClass, financialTableHeadClass, financialTableMonoCellClass, financialTableRowClass } from "./financial-theme";
import { MoneyCell } from "./money-cell";

export function LedgerTable({ items, locale }: { items: AdminFinancialLedgerEntry[]; locale: string }) {
  if (items.length === 0) return <FinancialEmptyState />;
  return (
    <FinancialTableShell ariaLabel="Financial ledger">
        <thead className={financialTableHeadClass}>
          <tr><th className="px-3 py-2">Entry</th><th className="px-3 py-2">User</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">Direction</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Source</th><th className="px-3 py-2">Description</th><th className="px-3 py-2">Created</th></tr>
        </thead>
        <tbody className={financialTableBodyClass}>
          {items.map((item) => (
            <tr key={item.id} className={financialTableRowClass}>
              <td className={financialTableMonoCellClass}>{item.id.slice(0, 8)}</td>
              <td className={financialTableCellClass}>{item.user?.name || "-"}</td>
              <td className={financialTableCellClass}>{formatStatus(item.transactionType)}</td>
              <td className={financialTableCellClass}>{formatStatus(item.direction)}</td>
              <td className={financialTableCellClass}><MoneyCell amount={item.amount} locale={locale} /></td>
              <td className={financialTableCellClass}>{item.sourceObject.type}</td>
              <td className={financialTableCellClass}>{item.description}</td>
              <td className={financialTableCellClass}>{formatDateTime(item.createdAt, locale)}</td>
            </tr>
          ))}
        </tbody>
    </FinancialTableShell>
  );
}
