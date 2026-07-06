import { getProfileImageSource } from "@/lib/profile/profile-image";

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
  isStaff?: boolean;
}

export type AuthStatus =
  "loading" | "authenticated" | "unauthenticated" | "expired" | "blocked";

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
  avatar?: string;
  avatar_url?: string;
  id: string;
  username: string;
  role: UserRole;
  full_name: string;
  profile_image?: string;
  profile_image_url?: string;
  profileImage?: string;
  image?: string;
  job_title?: string;
  is_available?: boolean;
  rating?: number;
  total_reviews?: number;
  is_staff?: boolean;
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
  avatar?: string;
  avatar_url?: string;
  id: string;
  username: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  profile_image?: string;
  profile_image_url?: string;
  profileImage?: string;
  image?: string;
  is_active: boolean;
  is_verified?: boolean;
  job_title?: string;
  is_available?: boolean;
  rating?: number;
  total_reviews?: number;
  is_staff?: boolean;
}

export function mapCurrentUserData(data: CurrentUserResponse): AuthUser {
  return {
    id: data.id,
    username: data.username,
    role: data.role,
    firstName: data.first_name || "",
    lastName: data.last_name || "",
    fullName: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
    email: data.email,
    phoneNumber: data.phone_number,
    profileImage: getProfileImageSource(data) || undefined,
    isActive: data.is_active !== false,
    isVerified: true,
    jobTitle: data.job_title,
    isAvailable: data.is_available,
    rating: data.rating,
    totalReviews: data.total_reviews,
    isStaff: data.is_staff === true,
  };
}

/** Map login userdata (from login response) to AuthUser */
export function mapLoginUserData(data: Record<string, unknown>): AuthUser {
  return {
    id: data.id as string,
    username: data.username as string,
    role: data.role as UserRole,
    firstName: "",
    lastName: "",
    fullName: (data.full_name as string) || "",
    email: data.email as string | undefined,
    phoneNumber: data.phone_number as string | undefined,
    profileImage: getProfileImageSource(data) || undefined,
    jobTitle: data.job_title as string | undefined,
    isActive: true,
    isVerified: true,
    isAvailable: data.is_available as boolean | undefined,
    rating: data.rating as number | undefined,
    totalReviews: data.total_reviews as number | undefined,
    isStaff: data.is_staff === true,
  };
}
