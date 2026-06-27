"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { hideReview, restoreReview } from "@/lib/api/reviews";

export function ReviewModerationActions({ reviewId, hidden }: { reviewId: string; hidden?: boolean }) {
  const [isHidden, setIsHidden] = useState(Boolean(hidden));

  async function handleToggle() {
    if (isHidden) {
      await restoreReview(reviewId, "Restored by staff");
      setIsHidden(false);
    } else {
      await hideReview(reviewId, "Hidden by staff");
      setIsHidden(true);
    }
  }

  return (
    <button
      type="button"
      data-testid={isHidden ? "admin-review-restore" : "admin-review-hide"}
      onClick={handleToggle}
      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm"
    >
      {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      {isHidden ? "Restore" : "Hide"}
    </button>
  );
}
