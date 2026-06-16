/**
 * Contract domain types (Phase 6 — minimal read-only view).
 */

export type Phase6ContractStatus = "draft";

export interface ContractClientSummary {
  user_id: string;
  full_name: string;
  profile_image?: string;
}

export interface ContractTechnicianSummary {
  user_id: string;
  full_name: string;
  job_title?: string;
  profile_image?: string;
}

export interface Phase6Contract {
  id: string;
  contract_reference: string;
  client: ContractClientSummary;
  technician: ContractTechnicianSummary;
  work_description: string;
  agreed_amount: string;
  currency: string;
  status: Phase6ContractStatus;
  client_accepted: boolean;
  technician_accepted: boolean;
  created_at: string;
  updated_at: string;
}
