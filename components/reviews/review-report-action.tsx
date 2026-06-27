"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { reportReview } from "@/lib/api/reviews";

export function ReviewReportAction({ reviewId }: { reviewId: string }) {
  const [done, setDone] = useState(false);

  async function handleReport() {
    await reportReview(reviewId, { reason: "other" });
    setDone(true);
  }

  return (
    <button
      type="button"
      data-testid="review-report"
      onClick={handleReport}
      disabled={done}
      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-60"
    >
      <Flag className="h-4 w-4" />
      {done ? "Reported" : "Report"}
    </button>
  );
}
