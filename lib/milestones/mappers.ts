/** Milestone safe mappers */

import type { Milestone } from "./types";

/** Sort milestones by sequence */
export function sortMilestones(milestones: Milestone[]): Milestone[] {
  return [...milestones].sort((a, b) => a.sequence - b.sequence);
}
