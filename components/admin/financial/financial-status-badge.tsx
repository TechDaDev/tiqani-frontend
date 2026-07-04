import { formatStatus } from "@/lib/admin/financial/format";

const tones: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  approved: "bg-blue-50 text-blue-700 ring-blue-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  processing: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  canceled: "bg-slate-100 text-slate-700 ring-slate-200",
};

export function FinancialStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ring-1 ${tones[status] || "bg-slate-100 text-slate-700 ring-slate-200"}`}>
      {formatStatus(status || "unknown")}
    </span>
  );
}
