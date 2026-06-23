"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Dispute } from "@/lib/disputes/types";
import { fetchDisputes } from "@/lib/api/disputes";
import { getDisputeStatusLabel, getDisputeStatusColor, isDisputeActive } from "@/lib/disputes/status";

export default function DisputesPage() {
  const t = useTranslations("disputes");
  const router = useRouter();
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
      const data = await fetchDisputes(statusFilter || undefined);
      setDisputes(data);
    } catch (e) {
      setError(t("errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-6">{t("loading")}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto" dir="auto">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

      <div className="mb-4 flex gap-2 flex-wrap">
        <button onClick={() => setStatusFilter("")}
          className={`px-3 py-1 rounded ${!statusFilter ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          {t("all")}
        </button>
        <button onClick={() => setStatusFilter("open")}
          className={`px-3 py-1 rounded ${statusFilter === "open" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          {t("status.open")}
        </button>
        <button onClick={() => setStatusFilter("under_review")}
          className={`px-3 py-1 rounded ${statusFilter === "under_review" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          {t("status.underReview")}
        </button>
        <button onClick={() => setStatusFilter("resolved")}
          className={`px-3 py-1 rounded ${statusFilter === "resolved" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          {t("status.resolved")}
        </button>
      </div>

      {error && <div className="bg-red-100 p-3 rounded mb-4 text-red-800">{error}</div>}

      {disputes.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">{t("empty")}</div>
      ) : (
        <div className="space-y-3">
          {disputes.map((d) => (
            <Link key={d.id} href={`/disputes/${d.id}`}
              className="block border rounded-lg p-4 hover:shadow-md transition cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{d.contract_reference}</p>
                  <p className="text-sm text-gray-600">{d.reason_display}</p>
                  <p className="text-sm text-gray-500">
                    {t("against")} {d.opened_by === "me" ? d.respondent_name : d.opened_by_name}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getDisputeStatusColor(d.status)}`}>
                    {d.status_display}
                  </span>
                  <p className="text-sm mt-1">{d.claimed_amount} {d.currency}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
