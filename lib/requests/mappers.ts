/**
 * Mappers between frontend camelCase and backend snake_case for request data.
 */

import type {
  ServiceRequest,
  CreateServiceRequestPayload,
  RequestClientSummary,
  RequestTechnicianSummary,
} from "./types";

/**
 * Map a backend ServiceRequest response to frontend types.
 */
export function mapServiceRequest(raw: Record<string, unknown>): ServiceRequest {
  const client = raw.client as Record<string, unknown> | undefined;
  const technician = raw.technician as Record<string, unknown> | undefined;

  return {
    id: String(raw.id ?? ""),
    client: client
      ? {
          user_id: String(client.user_id ?? ""),
          username: String(client.username ?? ""),
          full_name: String(client.full_name ?? ""),
          governorate: String(client.governorate ?? ""),
          profile_image: client.profile_image ? String(client.profile_image) : undefined,
        }
      : { user_id: "", username: "", full_name: "" },
    technician: technician
      ? {
          user_id: String(technician.user_id ?? ""),
          username: String(technician.username ?? ""),
          full_name: String(technician.full_name ?? ""),
          job_title: String(technician.job_title ?? ""),
          governorate: String(technician.governorate ?? ""),
          profile_image: technician.profile_image ? String(technician.profile_image) : undefined,
        }
      : { user_id: "", username: "", full_name: "" },
    category: raw.category ? String(raw.category) : undefined,
    category_name: raw.category_name ? String(raw.category_name) : undefined,
    skill: raw.skill ? String(raw.skill) : undefined,
    skill_name: raw.skill_name ? String(raw.skill_name) : undefined,
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    governorate: raw.governorate ? String(raw.governorate) : undefined,
    service_address: raw.service_address ? String(raw.service_address) : undefined,
    preferred_date: raw.preferred_date ? String(raw.preferred_date) : undefined,
    preferred_time: raw.preferred_time ? String(raw.preferred_time) : undefined,
    is_urgent: Boolean(raw.is_urgent),
    status: String(raw.status ?? "PENDING") as ServiceRequest["status"],
    created_at: String(raw.created_at ?? ""),
    updated_at: String(raw.updated_at ?? ""),
  };
}

/**
 * Map frontend create request data to backend snake_case payload.
 */
export function mapCreatePayload(
  data: Record<string, unknown>
): CreateServiceRequestPayload {
  return {
    technician: String(data.technician ?? ""),
    category: data.category ? String(data.category) : undefined,
    skill: data.skill ? String(data.skill) : undefined,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    governorate: data.governorate ? String(data.governorate) : undefined,
    service_address: data.service_address ? String(data.service_address) : undefined,
    preferred_date: data.preferredDate ? String(data.preferredDate) : undefined,
    preferred_time: data.preferredTime ? String(data.preferredTime) : undefined,
    is_urgent: Boolean(data.isUrgent ?? data.is_urgent),
  };
}
