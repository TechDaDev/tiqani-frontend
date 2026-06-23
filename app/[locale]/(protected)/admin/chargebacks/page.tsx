"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { ChargebackEvent } from "@/lib/chargebacks/types";
import { fetchAdminChargebacks } from "@/lib/api/chargebacks";
import { getChargebackStatusColor, getChargebackStatusLabel } from "@/lib/chargebacks/status";

export default function AdminChargebacksPage() {
  const t = useTranslations("chargebacks");
  const [chargebacks, setChargebacks] = useState<ChargebackEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChargebacks();
  }, []);

  async function loadChargebacks() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminChargebacks();
      setChargebacks(data);
    } catch {
      setError(t("errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-6">{t("loading")}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto" dir="auto">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

      {error && <div className="bg-red-100 p-3 rounded mb-4 text-red-800">{error}</div>}

      {chargebacks.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">{t("empty")}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">{t("contract")}</th>
                <th className="p-2 text-right">{t("amount")}</th>
                <th className="p-2 text-left">{t("reason")}</th>
                <th className="p-2 text-center">{t("statusCol")}</th>
                <th className="p-2 text-center">{t("outcome")}</th>
                <th className="p-2">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {chargebacks.map((cb) => (
                <tr key={cb.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{cb.contract_reference}</td>
                  <td className="p-2 text-right">{cb.amount}</td>
                  <td className="p-2">{cb.reason_code}</td>
                  <td className="p-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getChargebackStatusColor(cb.status)}`}>
                      {cb.status_display}
                    </span>
                  </td>
                  <td className="p-2 text-center text-xs">{cb.outcome || "-"}</td>
                  <td className="p-2">
                    <Link href={`/admin/chargebacks/${cb.id}`} className="text-blue-600 hover:underline">
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
