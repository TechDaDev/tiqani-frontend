import type { AdminTechnicianDetail } from "./types";

const missingReasonKeys: Record<string, string> = {
  documents: "missingDocuments",
  github_url: "missingGithub",
  linkedin_url: "missingLinkedin",
  active_account: "inactiveAccount",
  not_suspended: "suspendedAccount",
};

export function getTechnicianApprovalReasonKey(technician: AdminTechnicianDetail): string {
  if (technician.approved) return "alreadyApproved";
  const missing = technician.approvalRequirements.missing;
  for (const key of ["documents", "github_url", "linkedin_url", "active_account", "not_suspended"]) {
    if (missing.includes(key)) return missingReasonKeys[key];
  }
  if (!technician.approvalRequirements.canApprove) return "cannotApprove";
  return "";
}

export function technicianDocumentHref(technicianId: string, documentId: string): string {
  return `/api/admin/technicians/${technicianId}/documents/${documentId}`;
}
