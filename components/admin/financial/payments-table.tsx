import { formatDateTime } from "@/lib/admin/financial/format";
import type { AdminFinancialPayment } from "@/lib/admin/financial/types";
import { FinancialStatusBadge } from "./financial-status-badge";
import { FinancialEmptyState, FinancialTableShell, financialTableBodyClass, financialTableCellClass, financialTableHeadClass, financialTableMonoCellClass, financialTableRowClass } from "./financial-theme";
import { MoneyCell } from "./money-cell";

export function PaymentsTable({ items, locale }: { items: AdminFinancialPayment[]; locale: string }) {
  if (items.length === 0) return <FinancialEmptyState />;
  return (
    <FinancialTableShell ariaLabel="Financial payments">
        <thead className={financialTableHeadClass}>
          <tr><th className="px-3 py-2">Reference</th><th className="px-3 py-2">Payer</th><th className="px-3 py-2">Contract</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Provider</th><th className="px-3 py-2">Created</th></tr>
        </thead>
        <tbody className={financialTableBodyClass}>
          {items.map((item) => (
            <tr key={item.id} className={financialTableRowClass}>
              <td className={financialTableMonoCellClass}>{item.id.slice(0, 8)}</td>
              <td className={financialTableCellClass}>{item.payer?.name || "-"}</td>
              <td className={financialTableCellClass}>{item.contractReference || "-"}</td>
              <td className={financialTableCellClass}><MoneyCell amount={item.amount} currency={item.currency} locale={locale} /></td>
              <td className={financialTableCellClass}><FinancialStatusBadge status={item.status} /></td>
              <td className={financialTableCellClass}>{item.provider} {item.providerReferenceMasked}</td>
              <td className={financialTableCellClass}>{formatDateTime(item.createdAt, locale)}</td>
            </tr>
          ))}
        </tbody>
    </FinancialTableShell>
  );
}
