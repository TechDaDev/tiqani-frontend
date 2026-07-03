import type {
  AdminAuditEvent,
  AdminDashboard,
  AdminTechnician,
  AdminTechnicianDetail,
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

function number(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function objectList(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object") : [];
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
    address: text(record.address),
    gender: text(record.gender),
    dateOfBirth: text(record.date_of_birth),
    profileImage: text(record.profile_image),
    isActive: bool(record.is_active),
    isStaff: bool(record.is_staff),
    isSuperuser: bool(record.is_superuser),
    dateJoined: text(record.date_joined),
    lastLogin: text(record.last_login),
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
    yearsOfExpertise: number(record.years_of_expertise),
    isComplete: bool(record.is_complete),
    incompleteFields: stringList(record.incomplete_fields),
    createdAt: text(record.created_at),
  };
}

export function mapAdminTechnicianDetail(data: unknown): AdminTechnicianDetail {
  const record = (data ?? {}) as Record<string, unknown>;
  const user = mapAdminUser(record.user);
  const skillSets = (record.skill_sets ?? {}) as Record<string, unknown>;
  return {
    ...mapAdminTechnician({
      ...record,
      username: user.username,
      email: user.email,
      phone_number: user.phoneNumber,
      governorate: user.governorate,
    }),
    user,
    about: text(record.about),
    address: user.address,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    profileImage: text(record.profile_image || user.profileImage),
    identificationDocuments: text(record.identification_documents),
    github: text(record.github || record.url1),
    linkedin: text(record.linkedin || record.url2),
    balance: text(record.balance),
    walletId: text(record.wallet_id),
    lastActive: text(record.last_active),
    images: objectList(record.images).map((image) => ({
      id: text(image.id),
      image: text(image.image),
      description: text(image.description),
    })),
    skillSets: {
      categoriesDetail: objectList(skillSets.categories_detail).map((item) => ({ id: text(item.id), name: text(item.name) })),
      skillsDetail: objectList(skillSets.skills_detail).map((item) => ({ id: text(item.id), name: text(item.name) })),
      subSkillsDetail: objectList(skillSets.sub_skills_detail).map((item) => ({ id: text(item.id), name: text(item.name) })),
    },
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
