import type {
  AdminAuditEvent,
  AdminDashboard,
  AdminTechnician,
  AdminUser,
  Paginated,
  PlatformHealth,
} from "./types";

function text(value: unknown): string {
  return value == null ? "" : String(value);
}

function bool(value: unknown): boolean {
  return value === true;
}

function objectRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, val]) => [
      key,
      Number(val ?? 0),
    ])
  );
}

export function mapPaginated<T>(data: unknown, mapper: (item: unknown) => T): Paginated<T> {
  if (Array.isArray(data)) {
    return { count: data.length, next: null, previous: null, results: data.map(mapper) };
  }
  const record = (data ?? {}) as Record<string, unknown>;
  const rawResults = Array.isArray(record.results) ? record.results : [];
  return {
    count: Number(record.count ?? rawResults.length),
    next: record.next ? String(record.next) : null,
    previous: record.previous ? String(record.previous) : null,
    results: rawResults.map(mapper),
  };
}

export function mapAdminDashboard(data: unknown): AdminDashboard {
  const record = (data ?? {}) as Record<string, unknown>;
  return {
    users: objectRecord(record.users),
    technicians: objectRecord(record.technicians),
    contracts: objectRecord(record.contracts),
    finance: (record.finance ?? {}) as Record<string, string | number>,
    reviews: objectRecord(record.reviews),
    notifications: objectRecord(record.notifications),
  };
}

export function mapAdminUser(data: unknown): AdminUser {
  const record = (data ?? {}) as Record<string, unknown>;
  return {
    id: text(record.id),
    username: text(record.username),
    email: text(record.email),
    role: text(record.role),
    roleDisplay: text(record.role_display),
    firstName: text(record.first_name),
    lastName: text(record.last_name),
    phoneNumber: text(record.phone_number),
    governorate: text(record.governorate),
    isActive: bool(record.is_active),
    dateJoined: text(record.date_joined),
  };
}

export function mapAdminTechnician(data: unknown): AdminTechnician {
  const record = (data ?? {}) as Record<string, unknown>;
  return {
    id: text(record.id),
    username: text(record.username),
    email: text(record.email),
    phoneNumber: text(record.phone_number),
    jobTitle: text(record.job_title),
    rate: text(record.rate),
    approved: bool(record.approved),
    isAvailable: bool(record.is_available),
    governorate: text(record.governorate),
    createdAt: text(record.created_at),
  };
}

export function mapAuditEvent(data: unknown): AdminAuditEvent {
  const record = (data ?? {}) as Record<string, unknown>;
  return {
    id: text(record.id),
    verb: text(record.verb),
    actorName: text(record.actor_name),
    targetType: text(record.target_type),
    targetId: text(record.target_id),
    targetRepr: text(record.target_repr),
    metadata:
      record.metadata && typeof record.metadata === "object"
        ? (record.metadata as Record<string, unknown>)
        : {},
    createdAt: text(record.created_at),
  };
}

export function mapPlatformHealth(data: unknown): PlatformHealth {
  const record = (data ?? {}) as Record<string, unknown>;
  return {
    status: text(record.status),
    database: text(record.database),
    redis: text(record.redis),
    debug: bool(record.debug),
    version: text(record.version),
  };
}
