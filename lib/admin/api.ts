import { browserClient } from "@/lib/api/browser-client";
import {
  mapAdminDashboard,
  mapAdminTechnician,
  mapAdminTechnicianDetail,
  mapAdminUser,
  mapAuditEvent,
  mapPaginated,
  mapPlatformHealth,
} from "./mappers";
import type { AdminAuditEvent, AdminDashboard, AdminTechnician, AdminTechnicianDetail, AdminUser, Paginated, PlatformHealth } from "./types";

export async function fetchAdminDashboard(): Promise<AdminDashboard> {
  return mapAdminDashboard(await browserClient.get("/api/admin/dashboard/"));
}

export async function fetchAdminUsers(query = ""): Promise<Paginated<AdminUser>> {
  const suffix = query ? `?${query}` : "";
  return mapPaginated(await browserClient.get(`/api/admin/users/${suffix}`), mapAdminUser);
}

export async function fetchAdminUser(userId: string): Promise<AdminUser> {
  return mapAdminUser(await browserClient.get(`/api/admin/users/${userId}/`));
}

export async function suspendAdminUser(userId: string, reason: string) {
  return browserClient.post(`/api/admin/users/${userId}/suspend/`, { reason });
}

export async function restoreAdminUser(userId: string, reason: string) {
  return browserClient.post(`/api/admin/users/${userId}/restore/`, { reason });
}

export async function fetchAdminTechnicians(query = ""): Promise<Paginated<AdminTechnician>> {
  const suffix = query ? `?${query}` : "";
  return mapPaginated(await browserClient.get(`/api/admin/technicians/${suffix}`), mapAdminTechnician);
}

export async function fetchAdminTechnician(technicianId: string): Promise<AdminTechnicianDetail> {
  return mapAdminTechnicianDetail(await browserClient.get(`/api/admin/technicians/${technicianId}/`));
}

export async function approveTechnician(technicianId: string, reason: string) {
  return browserClient.post(`/api/admin/technicians/${technicianId}/approve/`, { reason });
}

export async function suspendTechnician(technicianId: string, reason: string) {
  return browserClient.post(`/api/admin/technicians/${technicianId}/suspend/`, { reason });
}

export async function fetchAuditEvents(): Promise<Paginated<AdminAuditEvent>> {
  return mapPaginated(await browserClient.get("/api/admin/audit-events/"), mapAuditEvent);
}

export async function fetchPlatformHealth(): Promise<PlatformHealth> {
  return mapPlatformHealth(await browserClient.get("/api/admin/platform-health/"));
}
