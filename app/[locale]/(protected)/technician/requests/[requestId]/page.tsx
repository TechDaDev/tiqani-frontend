"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Loader2, Check, X, FileText } from "lucide-react";
import { useTechnicianRequestDetail, useAcceptRequest, useDeclineRequest } from "@/lib/requests/query";
import { getAllowedTechnicianActions } from "@/lib/requests/status";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n/routing";
import Link from "next/link";

export default function TechnicianRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as Locale) || "ar";
  const requestId = params.requestId as string;
  const t = useTranslations("technicianRequests");
  const tCommon = useTranslations("common");

  const { data: request, isLoading, error } = useTechnicianRequestDetail(requestId);
  const { mutate: acceptRequest, isPending: isAccepting } = useAcceptRequest();
  const { mutate: declineRequest, isPending: isDeclining } = useDeclineRequest();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-soft/50 dark:bg-gray-700" />
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 animate-pulse rounded-lg bg-surface-warm dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {t("errors.loadFailed")}
        </div>
        <Link
          href={`/${locale}/technician/requests`}
          className="mt-4 inline-flex items-center text-sm text-primary hover:underline"
        >
          <ArrowRight className="ml-1 h-4 w-4" />
          {tCommon("back")}
        </Link>
      </div>
    );
  }

  const allowedActions = getAllowedTechnicianActions(request.status);

  const handleAccept = async () => {
    if (confirm(t("confirmAccept"))) {
      try {
        await acceptRequest(requestId);
        router.refresh();
      } catch {}
    }
  };

  const handleDecline = async () => {
    if (confirm(t("confirmDecline"))) {
      try {
        await declineRequest(requestId);
        router.refresh();
      } catch {}
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/${locale}/technician/requests`}
        className="mb-4 inline-flex items-center text-sm text-primary hover:underline"
      >
        <ArrowRight className="ml-1 h-4 w-4" />
        {tCommon("back")}
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{request.title}</h1>
        <RequestStatusBadge status={request.status} />
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">{t("clientInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{request.client.full_name}</p>
          {request.client.governorate && (
            <p className="text-sm text-foreground-muted">{request.client.governorate}</p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">{t("requestDetails")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground-muted">{t("description")}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm">{request.description}</p>
          </div>
          {request.category_name && (
            <div>
              <p className="text-sm font-medium text-foreground-muted">{t("category")}</p>
              <p className="text-sm">{request.category_name}</p>
            </div>
          )}
          {request.governorate && (
            <div>
              <p className="text-sm font-medium text-foreground-muted">{t("location")}</p>
              <p className="text-sm">
                {request.governorate}
                {request.service_address && ` - ${request.service_address}`}
              </p>
            </div>
          )}
          {request.preferred_date && (
            <div>
              <p className="text-sm font-medium text-foreground-muted">{t("preferredDate")}</p>
              <p className="text-sm">
                {request.preferred_date}
                {request.preferred_time && ` ${request.preferred_time}`}
              </p>
            </div>
          )}
          {request.is_urgent && (
            <div>
              <span className="text-sm font-medium text-red-500">{t("urgent")}</span>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-foreground-muted">{t("receivedAt")}</p>
            <p className="text-sm">{new Date(request.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      {allowedActions.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {allowedActions.includes("accept") && (
            <Button onClick={handleAccept} disabled={isAccepting} className="bg-green-600 hover:bg-green-700">
              {isAccepting ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="ml-2 h-4 w-4" />
              )}
              {t("acceptRequest")}
            </Button>
          )}
          {allowedActions.includes("decline") && (
            <Button variant="danger" onClick={handleDecline} disabled={isDeclining}>
              {isDeclining ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <X className="ml-2 h-4 w-4" />
              )}
              {t("declineRequest")}
            </Button>
          )}
        </div>
      )}

      {request.status === "ACCEPTED" && (
        <div className="mt-4">
          <Link href={`/${locale}/technician/offers/new/${requestId}`}>
            <Button className="w-full sm:w-auto">
              <FileText className="ml-2 h-4 w-4" />
              Create Offer
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
