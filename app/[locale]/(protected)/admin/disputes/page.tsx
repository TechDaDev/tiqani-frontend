"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { Dispute } from "@/lib/disputes/types";
import { fetchAdminDisputes } from "@/lib/api/disputes";
import { getDisputeStatusColor, getDisputeStatusLabel } from "@/lib/disputes/status";

export default function AdminDisputesPage() {
  const t = useTranslations("adminDisputes");
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDisputes();
  }, [statusFilter]);

  async function loadDisputes() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminDisputes(statusFilter || undefined);
      setDisputes(data);
    } catch {
      setError(t("errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-6">{t("loading")}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto" dir="auto">
      <h1 className="text-2xl font-bold mb-4">{t("queue")}</h1>

      <div className="mb-4 flex gap-2 flex-wrap">
        {["", "open", "awaiting_response", "under_review", "resolution_proposed", "resolved", "rejected"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded text-sm ${statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
            {s ? t(`status.${s}`) : t("all")}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-100 p-3 rounded mb-4 text-red-800">{error}</div>}

      {disputes.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">{t("empty")}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">{t("reference")}</th>
                <th className="p-2 text-left">{t("openedBy")}</th>
                <th className="p-2 text-left">{t("respondent")}</th>
                <th className="p-2 text-left">{t("reason")}</th>
                <th className="p-2 text-right">{t("amount")}</th>
                <th className="p-2 text-center">{t("statusCol")}</th>
                <th className="p-2 text-center">{t("assigned")}</th>
                <th className="p-2">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((d) => (
                <tr key={d.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{d.contract_reference}</td>
                  <td className="p-2">{d.opened_by_name}</td>
                  <td className="p-2">{d.respondent_name}</td>
                  <td className="p-2">{d.reason_display}</td>
                  <td className="p-2 text-right">{d.claimed_amount}</td>
                  <td className="p-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getDisputeStatusColor(d.status)}`}>
                      {d.status_display}
                    </span>
                  </td>
                  <td className="p-2 text-center text-xs">{d.assigned_staff_name || "-"}</td>
                  <td className="p-2">
                    <Link href={`/admin/disputes/${d.id}`} className="text-blue-600 hover:underline">
                      {t("view")}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
