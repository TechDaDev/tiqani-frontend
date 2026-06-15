export type UserRole =
  | "client"
  | "technician"
  | "dealership"
  | "system_admin"
  | "finance_admin"
  | "account_manager"
  | "content_moderator";

export interface AuthUser {
  id: string;
  publicId?: string;
  username: string;
  email?: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  profileImage?: string;
  jobTitle?: string;
  isActive: boolean;
  isVerified: boolean;
  isAvailable?: boolean;
  rating?: number;
  totalReviews?: number;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "expired" | "blocked";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  userdata: LoginUserData;
}

export interface LoginUserData {
  id: string;
  username: string;
  role: UserRole;
  full_name: string;
  profile_image?: string;
  job_title?: string;
  is_available?: boolean;
  rating?: number;
  total_reviews?: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "client" | "technician";
  phone_number?: string;
  governorate?: string;
  address?: string;
  gender?: "male" | "female";
  date_of_birth?: string;
  job_title?: string;
  about?: string;
  years_of_expertise?: number;
}

export interface RegisterResponse {
  detail: string;
  email: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp_code: string;
}

export interface VerifyEmailResponse {
  detail: string;
  username: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  detail: string;
  email: string;
  resends_remaining: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp_code: string;
  new_password: string;
}

export interface CurrentUserResponse {
  id: string;
  username: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  profile_image?: string;
  is_active: boolean;
  is_verified?: boolean;
}

export function mapUserData(data: CurrentUserResponse | LoginUserData): AuthUser {
  return {
    id: data.id,
    username: data.username,
    role: data.role,
    firstName: (data as CurrentUserResponse).first_name || "",
    lastName: (data as CurrentUserResponse).last_name || "",
    fullName: (data as LoginUserData).full_name || `${(data as CurrentUserResponse).first_name || ""} ${(data as CurrentUserResponse).last_name || ""}`.trim(),
    email: (data as CurrentUserResponse).email,
    profileImage: (data as LoginUserData).profile_image || (data as CurrentUserResponse).profile_image,
    jobTitle: (data as LoginUserData).job_title,
    isActive: (data as CurrentUserResponse).is_active !== false,
    isVerified: (data as CurrentUserResponse).is_verified !== false,
    isAvailable: (data as LoginUserData).is_available,
    rating: (data as LoginUserData).rating,
    totalReviews: (data as LoginUserData).total_reviews,
  };
}
