import { formatDateTime, formatStatus } from "@/lib/admin/financial/format";
import type { AdminFinancialAuditEvent } from "@/lib/admin/financial/types";
import { FinancialEmptyState, FinancialTableShell, financialTableBodyClass, financialTableCellClass, financialTableHeadClass, financialTableRowClass } from "./financial-theme";

export function FinancialAuditTable({ items, locale }: { items: AdminFinancialAuditEvent[]; locale: string }) {
  if (items.length === 0) return <FinancialEmptyState />;
  return (
    <FinancialTableShell ariaLabel="Financial audit events">
        <thead className={financialTableHeadClass}>
          <tr><th className="px-3 py-2">Event</th><th className="px-3 py-2">Actor</th><th className="px-3 py-2">Target</th><th className="px-3 py-2">Amount</th><th className="px-3 py-2">Reason</th><th className="px-3 py-2">Source</th><th className="px-3 py-2">Time</th></tr>
        </thead>
        <tbody className={financialTableBodyClass}>
          {items.map((item) => (
            <tr key={item.id} className={financialTableRowClass}>
              <td className={financialTableCellClass}>{formatStatus(item.verb)}</td>
              <td className={financialTableCellClass}>{item.actor?.name || "-"}</td>
              <td className={financialTableCellClass}>{item.targetType || "-"}</td>
              <td className={financialTableCellClass}>{item.amount || "-"}</td>
              <td className={financialTableCellClass}>{item.reason || "-"}</td>
              <td className={financialTableCellClass}>{item.sourceService || "-"}</td>
              <td className={financialTableCellClass}>{formatDateTime(item.createdAt, locale)}</td>
            </tr>
          ))}
        </tbody>
    </FinancialTableShell>
  );
}
