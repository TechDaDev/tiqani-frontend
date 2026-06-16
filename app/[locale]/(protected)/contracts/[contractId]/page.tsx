"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { browserRequest } from "@/lib/api/browser-client";
import { ContractStatusBadge } from "@/components/contracts/contract-status-badge";
import { MoneyDisplay } from "@/components/offers/money-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Phase6Contract } from "@/lib/contracts/types";
import type { Locale } from "@/lib/i18n/routing";

function mapContract(raw: Record<string, unknown>): Phase6Contract {
  return {
    id: raw.id as string,
    contract_reference: raw.contract_reference as string,
    client: raw.client as Phase6Contract["client"],
    technician: raw.technician as Phase6Contract["technician"],
    work_description: raw.work_description as string,
    agreed_amount: raw.agreed_amount as string,
    currency: raw.currency as string,
    status: raw.status as Phase6Contract["status"],
    client_accepted: raw.client_accepted as boolean,
    technician_accepted: raw.technician_accepted as boolean,
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
  };
}

export default function ContractDetailPage() {
  const params = useParams();
  const locale = (params.locale as Locale) || "ar";
  const contractId = params.contractId as string;
  const t = useTranslations("contracts");
  const tOffers = useTranslations("offers");
  const tCommon = useTranslations("common");

  const [contract, setContract] = useState<Phase6Contract | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContract = useCallback(async () => {
    if (!contractId) return;
    setIsLoading(true);
    setError(null);
    try {
      const raw = await browserRequest<Record<string, unknown>>(`/api/contracts/${contractId}/`);
      setContract(raw ? mapContract(raw) : null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load contract"));
    } finally {
      setIsLoading(false);
    }
  }, [contractId]);

  useEffect(() => { fetchContract(); }, [fetchContract]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">{tOffers("offerErrors.notFound")}</p>
        <Link href={`/${locale}/offers`} className="mt-4 inline-flex items-center text-sm text-primary hover:underline">
          <ArrowRight className="ml-1 h-4 w-4" />
          {tCommon("back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("contractDetail")}</CardTitle>
            <p className="text-sm text-muted-foreground">{contract.contract_reference}</p>
          </div>
          <ContractStatusBadge status={contract.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{t("client")}</p>
            <p className="font-medium">{contract.client?.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("technician")}</p>
            <p className="font-medium">{contract.technician?.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("workDescription")}</p>
            <p className="whitespace-pre-wrap text-sm">{contract.work_description}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("agreedAmount")}</p>
            <MoneyDisplay amount={contract.agreed_amount} className="text-lg" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("createdAt")}</p>
            <p className="font-medium">{new Date(contract.created_at).toLocaleDateString()}</p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            <p>{t("createdFromOffer")}</p>
            <p className="mt-1">{t("paymentNote")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
