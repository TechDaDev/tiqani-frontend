/**
 * Service Request domain types.
 * Mirrors backend ServiceRequest model.
 */

export type RequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "CANCELLED"
  | "WITHDRAWN";

export interface RequestClientSummary {
  user_id: string;
  username: string;
  full_name: string;
  governorate?: string;
  profile_image?: string;
}

export interface RequestTechnicianSummary {
  user_id: string;
  username: string;
  full_name: string;
  job_title?: string;
  governorate?: string;
  profile_image?: string;
}

export interface ServiceRequest {
  id: string;
  client: RequestClientSummary;
  technician: RequestTechnicianSummary;
  category?: string;
  category_name?: string;
  skill?: string;
  skill_name?: string;
  title: string;
  description: string;
  governorate?: string;
  service_address?: string;
  preferred_date?: string;
  preferred_time?: string;
  is_urgent: boolean;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceRequestPayload {
  technician: string;
  category?: string;
  skill?: string;
  title: string;
  description: string;
  governorate?: string;
  service_address?: string;
  preferred_date?: string;
  preferred_time?: string;
  is_urgent?: boolean;
}

export interface RequestListFilters {
  status?: RequestStatus;
}
