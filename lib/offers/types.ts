/**
 * Offer domain types.
 * Mirrors backend Offer model and related summaries.
 */

export type OfferStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface OfferTechnicianSummary {
  user_id: string;
  full_name: string;
  job_title?: string;
  governorate?: string;
  profile_image?: string;
}

export interface OfferClientSummary {
  user_id: string;
  full_name: string;
  governorate?: string;
  profile_image?: string;
}

export interface OfferRequestSummary {
  id: string;
  title: string;
  status: string;
  is_urgent: boolean;
  created_at: string;
}

export interface Offer {
  id: string;
  service_request: string;
  request?: OfferRequestSummary;
  technician: OfferTechnicianSummary;
  client: OfferClientSummary;
  amount: string;
  currency: string;
  description: string;
  duration_days?: number;
  status: OfferStatus;
  request_title?: string;
  request_status?: string;
  can_edit: boolean;
  can_withdraw: boolean;
  is_terminal: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateOfferPayload {
  service_request_id: string;
  amount: string;
  description: string;
  duration_days?: number | null;
}

export interface UpdateOfferPayload {
  amount?: string;
  description?: string;
  duration_days?: number | null;
}

export interface AcceptOfferResponse {
  detail: string;
  offer_id: string;
  contract_id: string;
  offer_status: string;
}

export interface OfferListFilters {
  status?: OfferStatus;
}
