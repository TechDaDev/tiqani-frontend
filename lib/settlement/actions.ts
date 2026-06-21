/**
 * Settlement action helpers.
 */
import type { SettlementStatus } from "./types";

export function canReleaseEscrow(role: string, contractStatus: string, settlementStatus?: SettlementStatus): boolean {
  if (role !== "client") return false;
  if (contractStatus !== "completed") return false;
  if (settlementStatus === "completed") return false;
  return true;
}

export function canViewSettlement(role: string, contractStatus: string): boolean {
  if (role === "admin") return true;
  if (contractStatus === "completed") return true;
  return false;
}
