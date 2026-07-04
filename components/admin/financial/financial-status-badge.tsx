import { formatStatus } from "@/lib/admin/financial/format";

const tones: Record<string, string> = {
  paid: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/40",
  completed: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/40",
  approved: "bg-cyan-500/15 text-cyan-200 ring-cyan-400/40",
  pending: "bg-amber-500/15 text-amber-200 ring-amber-400/40",
  processing: "bg-indigo-500/15 text-indigo-200 ring-indigo-400/40",
  failed: "bg-red-500/15 text-red-200 ring-red-400/40",
  rejected: "bg-red-500/15 text-red-200 ring-red-400/40",
  canceled: "bg-slate-500/20 text-slate-200 ring-slate-400/40",
};

export function FinancialStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ring-1 ${tones[status] || "bg-slate-500/20 text-slate-200 ring-slate-400/40"}`}>
      {formatStatus(status || "unknown")}
    </span>
  );
}
