"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Loader2 } from "lucide-react";
import { useClientRequestDetail, useCancelRequest, useWithdrawRequest } from "@/lib/requests/query";
import { getAllowedClientActions } from "@/lib/requests/status";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n/routing";
import Link from "next/link";

export default function ClientRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as Locale) || "ar";
  const requestId = params.requestId as string;
  const t = useTranslations("clientRequests");
  const tCommon = useTranslations("common");

  const { data: request, isLoading, error } = useClientRequestDetail(requestId);
  const { mutate: cancelRequest, isPending: isCancelling } = useCancelRequest();
  const { mutate: withdrawRequest, isPending: isWithdrawing } = useWithdrawRequest();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
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
          href={`/${locale}/client/requests`}
          className="mt-4 inline-flex items-center text-sm text-primary hover:underline"
        >
          <ArrowRight className="ml-1 h-4 w-4" />
          {tCommon("back")}
        </Link>
      </div>
    );
  }

  const allowedActions = getAllowedClientActions(request.status);

  const handleCancel = async () => {
    if (confirm(t("confirmCancel"))) {
      try {
        await cancelRequest(requestId);
        router.refresh();
      } catch {}
    }
  };

  const handleWithdraw = async () => {
    if (confirm(t("confirmWithdraw"))) {
      try {
        await withdrawRequest(requestId);
        router.refresh();
      } catch {}
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/${locale}/client/requests`}
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
          <CardTitle className="text-lg">{t("technicianInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{request.technician.full_name}</p>
          {request.technician.job_title && (
            <p className="text-sm text-foreground-muted">{request.technician.job_title}</p>
          )}
          {request.technician.governorate && (
            <p className="text-sm text-foreground-muted">{request.technician.governorate}</p>
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
              <p className="text-sm font-medium text-foreground-muted">{t("governorate")}</p>
              <p className="text-sm">{request.governorate}</p>
            </div>
          )}
          {request.service_address && (
            <div>
              <p className="text-sm font-medium text-foreground-muted">{t("serviceAddress")}</p>
              <p className="text-sm">{request.service_address}</p>
            </div>
          )}
          {request.preferred_date && (
            <div>
              <p className="text-sm font-medium text-foreground-muted">{t("preferredDate")}</p>
              <p className="text-sm">{request.preferred_date}</p>
            </div>
          )}
          {request.preferred_time && (
            <div>
              <p className="text-sm font-medium text-foreground-muted">{t("preferredTime")}</p>
              <p className="text-sm">{request.preferred_time}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-foreground-muted">{t("createdAt")}</p>
            <p className="text-sm">{new Date(request.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      {allowedActions.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {allowedActions.includes("cancel") && (
            <Button variant="danger" onClick={handleCancel} disabled={isCancelling}>
              {isCancelling ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
              {t("cancelRequest")}
            </Button>
          )}
          {allowedActions.includes("withdraw") && (
            <Button variant="outline" onClick={handleWithdraw} disabled={isWithdrawing}>
              {isWithdrawing ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
              {t("withdrawRequest")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
