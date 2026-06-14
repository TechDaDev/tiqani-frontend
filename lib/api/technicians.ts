import { apiGet, ApiClientError } from "./client";

export type Technician = {
  id: string | number;
  name: string;
  title?: string;
  location?: string;
  rating?: number;
  is_verified?: boolean;
  is_available?: boolean;
  skills?: string[];
  profile_image?: string;
};

export async function fetchFeaturedTechnicians(): Promise<{
  data?: Technician[];
  error?: string;
}> {
  try {
    const data = await apiGet<Technician[]>("/api/technicians/featured/");
    return { data };
  } catch (error) {
    if (error instanceof ApiClientError) {
      return { error: error.message };
    }
    return { error: "Unable to load technicians" };
  }
}
