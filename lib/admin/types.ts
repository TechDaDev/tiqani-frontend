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
  address: string;
  gender: string;
  dateOfBirth: string;
  profileImage: string;
  isActive: boolean;
  isStaff: boolean;
  isSuperuser: boolean;
  dateJoined: string;
  lastLogin: string;
  profiles: {
    client: { exists: boolean; isComplete: boolean };
    technician: {
      exists: boolean;
      isComplete: boolean;
      approved: boolean;
      jobTitle: string;
      missingFields: string[];
    };
  };
  activity: Record<string, number>;
  financialSummary: {
    walletExists: boolean;
    walletBalance: string;
    paymentIntents: number;
    withdrawals: number;
  };
  recentAuditEvents: Array<{
    id: string;
    verb: string;
    targetType: string;
    targetId: string;
    createdAt: string;
  }>;
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
  yearsOfExpertise: number;
  isComplete: boolean;
  incompleteFields: string[];
  hasDocuments: boolean;
  hasGithub: boolean;
  hasLinkedin: boolean;
  createdAt: string;
};

export type AdminTechnicianDocument = {
  id: string;
  name: string;
  type: string;
  status: string;
  uploadedAt: string;
  size: number | null;
  downloadUrl: string;
};

export type AdminTechnicianApprovalChecklistItem = {
  key: string;
  passed: boolean;
};

export type AdminTechnicianDetail = AdminTechnician & {
  user: AdminUser;
  about: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  profileImage: string;
  identificationDocuments: string;
  github: string;
  linkedin: string;
  balance: string;
  walletId: string;
  lastActive: string;
  approvalRequirements: {
    canApprove: boolean;
    missing: string[];
    checklist: AdminTechnicianApprovalChecklistItem[];
  };
  documents: AdminTechnicianDocument[];
  images: Array<{ id: string; image: string; description: string }>;
  skillSets: {
    categoriesDetail: Array<{ id: string | number; name: string }>;
    skillsDetail: Array<{ id: string | number; name: string }>;
    subSkillsDetail: Array<{ id: string | number; name: string }>;
  };
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
