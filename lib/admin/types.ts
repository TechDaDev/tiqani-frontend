export type AdminDashboard = {
  users: Record<string, number>;
  technicians: Record<string, number>;
  contracts: Record<string, number>;
  finance: Record<string, string | number>;
  reviews: Record<string, number>;
  notifications: Record<string, number>;
};

export type AdminUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  roleDisplay: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  governorate: string;
  isActive: boolean;
  dateJoined: string;
};

export type AdminTechnician = {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  rate: string;
  approved: boolean;
  isAvailable: boolean;
  governorate: string;
  createdAt: string;
};

export type AdminAuditEvent = {
  id: string;
  verb: string;
  actorName: string;
  targetType: string;
  targetId: string;
  targetRepr: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type PlatformHealth = {
  status: string;
  database: string;
  redis: string;
  debug: boolean;
  version: string;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
