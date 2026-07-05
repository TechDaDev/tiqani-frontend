"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { mapWalletRechargeRequests } from "@/lib/wallet/mappers";
import type { WalletRechargeRequest } from "@/lib/wallet/types";

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const maxBytes = 5 * 1024 * 1024;

export function WalletRechargePanel({ onChanged }: { onChanged?: () => void }) {
  const t = useTranslations("wallet");
  const [items, setItems] = useState<WalletRechargeRequest[]>([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const pendingExists = useMemo(() => items.some((item) => item.status === "pending_review"), [items]);

  async function load() {
    const response = await fetch("/api/wallet/recharge-requests/", { cache: "no-store" });
    if (response.ok) setItems(mapWalletRechargeRequests(await response.json()));
  }

  useEffect(() => { void load(); }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!file) {
      setMessage(t("receiptRequired"));
      return;
    }
    if (!allowedTypes.includes(file.type) || file.size > maxBytes) {
      setMessage(t("receiptInvalid"));
      return;
    }
    const formData = new FormData();
    formData.set("amount", amount);
    formData.set("note", note);
    formData.set("receipt_file", file);
    setLoading(true);
    try {
      const response = await fetch("/api/wallet/recharge-requests/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(String(data.detail || t("rechargeFailed")));
      }
      setAmount("");
      setNote("");
      setFile(null);
      setMessage(t("rechargeSubmitted"));
      await load();
      onChanged?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("rechargeFailed"));
    } finally {
      setLoading(false);
    }
  }

  async function cancel(id: string) {
    setMessage("");
    const response = await fetch(`/api/wallet/recharge-requests/${id}/cancel/`, { method: "POST" });
    if (!response.ok) {
      setMessage(t("cancelFailed"));
      return;
    }
    await load();
  }

  return (
    <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{t("recharge")}</h2>
        <p className="mt-1 text-sm text-gray-600">{t("rechargeHelp")}</p>
      </div>
      <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={submit}>
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          inputMode="decimal"
          placeholder={t("amount")}
          disabled={pendingExists || loading}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          required
        />
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={t("note")}
          disabled={pendingExists || loading}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          disabled={pendingExists || loading}
          className="text-sm"
          required
        />
        <button
          type="submit"
          disabled={pendingExists || loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {t("submitRecharge")}
        </button>
      </form>
      {pendingExists ? <p className="text-sm text-amber-700">{t("onePendingRequestOnly")}</p> : null}
      {message ? <p className="text-sm text-gray-700" role="status">{message}</p> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b text-xs uppercase text-gray-500">
            <tr>
              <th className="py-2">{t("amount")}</th>
              <th className="py-2">{t("status")}</th>
              <th className="py-2">{t("receipt")}</th>
              <th className="py-2">{t("reviewNote")}</th>
              <th className="py-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-2">{item.amount} {item.currency}</td>
                <td className="py-2">{t(item.status)}</td>
                <td className="py-2">
                  {item.receiptDownloadUrl ? (
                    <a className="text-blue-600 hover:underline" href={item.receiptDownloadUrl}>{t("downloadReceipt")}</a>
                  ) : "-"}
                </td>
                <td className="py-2">{item.reviewNote || "-"}</td>
                <td className="py-2">
                  {item.status === "pending_review" ? (
                    <button className="text-sm text-red-600 hover:underline" type="button" onClick={() => cancel(item.id)}>
                      {t("cancel")}
                    </button>
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
