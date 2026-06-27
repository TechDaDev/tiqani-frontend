import type { ReputationSnapshot } from "@/lib/reputation/types";

export function ReputationSummary({ reputation }: { reputation: ReputationSnapshot }) {
  return (
    <section data-testid="reputation-summary" className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Reputation</h2>
          <p className="text-sm text-foreground-muted">{reputation.role}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold">{Number(reputation.average_rating).toFixed(1)}</div>
          <div className="text-sm text-foreground-muted">{reputation.review_count} reviews</div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md bg-muted p-3">
          <div className="text-xl font-semibold">{reputation.completed_contract_count}</div>
          <div className="text-sm text-foreground-muted">Completed contracts</div>
        </div>
        <div className="rounded-md bg-muted p-3">
          <div className="text-xl font-semibold capitalize">{reputation.label.replace("_", " ")}</div>
          <div className="text-sm text-foreground-muted">Transparent trust label</div>
        </div>
      </div>
    </section>
  );
}
