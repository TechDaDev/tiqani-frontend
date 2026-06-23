/** Role-aware action predicates for dispute UI. */
import type { Dispute, DisputeStatus } from "./types";

export interface UserRole {
  isClient: boolean;
  isTechnician: boolean;
  isStaff: boolean;
  userId: string;
}

export function canOpenDispute(eligible: boolean, role: UserRole): boolean {
  return eligible && (role.isClient || role.isTechnician);
}

export function canCancelDispute(dispute: Dispute, role: UserRole): boolean {
  if (!role.isClient && !role.isTechnician) return false;
  if (dispute.opened_by !== role.userId) return false;
  return ["open", "awaiting_response"].includes(dispute.status);
}

export function canAddStatement(dispute: Dispute, role: UserRole): boolean {
  if (role.isStaff) return false;
  const participantIds = [dispute.opened_by, dispute.respondent];
  if (!participantIds.includes(role.userId)) return false;
  return ["open", "awaiting_response", "under_review"].includes(dispute.status);
}

export function canAddEvidence(dispute: Dispute, role: UserRole): boolean {
  if (role.isStaff) return false;
  const participantIds = [dispute.opened_by, dispute.respondent];
  if (!participantIds.includes(role.userId)) return false;
  return ["open", "awaiting_response", "under_review", "mediation"].includes(dispute.status);
}

export function canViewDispute(dispute: Dispute, role: UserRole): boolean {
  if (role.isStaff) return true;
  return [dispute.opened_by, dispute.respondent].includes(role.userId);
}

/** Staff-only actions */
export const staffActions = {
  canAssign: (role: UserRole) => role.isStaff,
  canStartReview: (dispute: { status: DisputeStatus }, role: UserRole) =>
    role.isStaff && ["open", "awaiting_response"].includes(dispute.status),
  canStartMediation: (dispute: { status: DisputeStatus }, role: UserRole) =>
    role.isStaff && ["under_review", "resolution_proposed"].includes(dispute.status),
  canProposeResolution: (dispute: { status: DisputeStatus }, role: UserRole) =>
    role.isStaff && ["under_review", "mediation"].includes(dispute.status),
  canResolve: (dispute: { status: DisputeStatus }, role: UserRole) =>
    role.isStaff && ["resolution_proposed", "under_review", "mediation"].includes(dispute.status),
  canReject: (dispute: { status: DisputeStatus }, role: UserRole) =>
    role.isStaff && dispute.status === "under_review",
  canClose: (dispute: { status: DisputeStatus }, role: UserRole) =>
    role.isStaff && ["resolved", "rejected"].includes(dispute.status),
};

export function getParticipantRole(userId: string, dispute: Dispute): "opener" | "respondent" | "none" {
  if (dispute.opened_by === userId) return "opener";
  if (dispute.respondent === userId) return "respondent";
  return "none";
}
