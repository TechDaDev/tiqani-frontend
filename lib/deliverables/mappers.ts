/** Deliverable status helpers */

export function getVersionLabel(version: number): string {
  return `v${version}`;
}

export function isLatestSubmission(
  version: number,
  latestVersion: number,
): boolean {
  return version === latestVersion;
}
