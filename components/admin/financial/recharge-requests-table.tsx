"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/admin/financial/format";
import type { AdminFinancialRechargeRequest } from "@/lib/admin/financial/types";
import { FinancialStatusBadge } from "./financial-status-badge";
import { MoneyCell } from "./money-cell";
import {
  FinancialEmptyState,
  FinancialTableShell,
  financialTableBodyClass,
  financialTableCellClass,
  financialTableHeadClass,
  financialTableMonoCellClass,
  financialTableRowClass,
} from "./financial-theme";

export function RechargeRequestsTable({
  items,
  locale,
  onApprove,
  onReject,
}: {
  items: AdminFinancialRechargeRequest[];
  locale: string;
  onApprove: (item: AdminFinancialRechargeRequest, note: string) => Promise<void>;
  onReject: (item: AdminFinancialRechargeRequest, note: string) => Promise<void>;
}) {
  const [activeId, setActiveId] = useState("");
  const [note, setNote] = useState("");
  if (!items.length) return <FinancialEmptyState>No recharge requests.</FinancialEmptyState>;
  return (
    <FinancialTableShell ariaLabel="Wallet recharge requests">
      <thead className={financialTableHeadClass}>
        <tr>
          <th className={financialTableCellClass}>ID</th>
          <th className={financialTableCellClass}>User</th>
          <th className={financialTableCellClass}>Amount</th>
          <th className={financialTableCellClass}>Status</th>
          <th className={financialTableCellClass}>Receipt</th>
          <th className={financialTableCellClass}>Submitted</th>
          <th className={financialTableCellClass}>Review</th>
        </tr>
      </thead>
      <tbody className={financialTableBodyClass}>
        {items.map((item) => (
          <tr key={item.id} className={financialTableRowClass}>
            <td className={financialTableMonoCellClass}>{item.id.slice(0, 8)}</td>
            <td className={financialTableCellClass}>
              <div>{item.user?.name || "-"}</div>
              <div className="text-xs text-foreground-muted">{item.user?.email || ""}</div>
            </td>
            <td className={financialTableCellClass}><MoneyCell amount={item.amount} currency={item.currency} locale={locale} /></td>
            <td className={financialTableCellClass}><FinancialStatusBadge status={item.status} /></td>
            <td className={financialTableCellClass}>
              {item.receiptDownloadUrl ? (
                <a className="text-primary hover:underline" href={item.receiptDownloadUrl}>
                  {item.originalFilename || "Receipt"}
                </a>
              ) : "-"}
            </td>
            <td className={financialTableCellClass}>{formatDateTime(item.createdAt, locale)}</td>
            <td className={financialTableCellClass}>
              {item.status === "pending_review" ? (
                <div className="flex min-w-64 flex-col gap-2">
                  <textarea
                    value={activeId === item.id ? note : ""}
                    onFocus={() => {
                      setActiveId(item.id);
                      setNote("");
                    }}
                    onChange={(event) => {
                      setActiveId(item.id);
                      setNote(event.target.value);
                    }}
                    className="min-h-16 rounded-md border border-border bg-background px-2 py-1 text-sm"
                    placeholder="Review note"
                  />
                  <div className="flex gap-2">
                    <button className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white" type="button" onClick={() => onApprove(item, activeId === item.id ? note : "")}>
                      Approve
                    </button>
                    <button className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white" type="button" onClick={() => onReject(item, activeId === item.id ? note : "")}>
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-sm text-foreground-muted">{item.reviewNote || item.approvedTransactionId || "-"}</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </FinancialTableShell>
  );
}
