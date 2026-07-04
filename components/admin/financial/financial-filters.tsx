"use client";

export function FinancialFilters({
  status,
  onStatus,
  statuses,
}: {
  status: string;
  onStatus: (status: string) => void;
  statuses: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {["", ...statuses].map((item) => (
        <button
          key={item || "all"}
          type="button"
          onClick={() => onStatus(item)}
          className={`rounded px-3 py-1 text-xs font-medium ${status === item ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          {item || "All"}
        </button>
      ))}
    </div>
  );
}
