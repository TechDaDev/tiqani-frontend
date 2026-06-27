import { BadgeCheck, Briefcase, Star } from "lucide-react";
import type { ReputationSnapshot } from "@/lib/reputation/types";

export function TrustIndicators({ reputation }: { reputation: ReputationSnapshot }) {
  return (
    <div data-testid="trust-indicators" className="grid gap-2 sm:grid-cols-3">
      <div className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm">
        <Star className="h-4 w-4 text-amber-600" />
        {reputation.review_count} contract reviews
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm">
        <Briefcase className="h-4 w-4 text-primary" />
        {reputation.completed_contract_count} completed
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm">
        <BadgeCheck className="h-4 w-4 text-primary" />
        {reputation.label.replace("_", " ")}
      </div>
    </div>
  );
}
