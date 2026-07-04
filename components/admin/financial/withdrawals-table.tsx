import { formatDateTime } from "@/lib/admin/financial/format";
import type { AdminFinancialWithdrawal } from "@/lib/admin/financial/types";
import { FinancialStatusBadge } from "./financial-status-badge";
import { FinancialEmptyState, FinancialTableShell, financialTableBodyClass, financialTableCellClass, financialTableHeadClass, financialTableMonoCellClass, financialTableRowClass } from "./financial-theme";
import { MoneyCell } from "./money-cell";

export function WithdrawalsTable({ items, locale }: { items: AdminFinancialWithdrawal[]; locale: string }) {
  if (items.length === 0) return <FinancialEmptyState />;
  return (
    <FinancialTableShell ariaLabel="Financial withdrawals">
        <thead className={financialTableHeadClass}>
          <tr><th className="px-3 py-2">Withdrawal</th><th className="px-3 py-2">User</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Method</th><th className="px-3 py-2">Requested</th><th className="px-3 py-2">Reviewed</th></tr>
        </thead>
        <tbody className={financialTableBodyClass}>
          {items.map((item) => (
            <tr key={item.id} className={financialTableRowClass}>
              <td className={financialTableMonoCellClass}>{item.id.slice(0, 8)}</td>
              <td className={financialTableCellClass}>{item.user?.name || "-"}</td>
              <td className={financialTableCellClass}><MoneyCell amount={item.amount} currency={item.currency} locale={locale} /></td>
              <td className={financialTableCellClass}><FinancialStatusBadge status={item.status} /></td>
              <td className={financialTableCellClass}>{item.requestedMethodMasked || "-"}</td>
              <td className={financialTableCellClass}>{formatDateTime(item.createdAt, locale)}</td>
              <td className={financialTableCellClass}>{formatDateTime(item.reviewedAt, locale) || "-"}</td>
            </tr>
          ))}
        </tbody>
    </FinancialTableShell>
  );
}
