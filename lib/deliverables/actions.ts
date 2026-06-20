/** Deliverable & revision action helpers */

import type { DeliverableSubmission } from "./types";

/** Get latest submission version */
export function getLatestSubmission(
  submissions: DeliverableSubmission[],
): DeliverableSubmission | undefined {
  return submissions.reduce((latest, sub) =>
    sub.version > latest.version ? sub : latest,
  );
}

/** Check if a submission is the latest version */
export function isLatestVersion(
  submission: DeliverableSubmission,
  allSubmissions: DeliverableSubmission[],
): boolean {
  const latest = getLatestSubmission(allSubmissions);
  return latest?.id === submission.id;
}
