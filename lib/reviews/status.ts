export function reviewStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    published: "Published",
    under_review: "Under review",
    hidden: "Hidden",
    removed: "Removed",
  };
  return labels[status] || status;
}

export function reviewEligibilityMessage(reason: string): string {
  const messages: Record<string, string> = {
    ELIGIBLE: "Review available",
    NOT_PARTICIPANT: "Only contract participants can review.",
    CONTRACT_NOT_COMPLETED: "Reviews open after contract completion.",
    UNRESOLVED_DISPUTE: "Reviews pause while a dispute remains unresolved.",
    ALREADY_REVIEWED: "Review already submitted.",
    SELF_REVIEW: "Self review is not allowed.",
  };
  return messages[reason] || "Review unavailable.";
}
