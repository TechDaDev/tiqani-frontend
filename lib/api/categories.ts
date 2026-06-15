import { apiGet, ApiClientError } from "./client";
import type { ApiError } from "./client";

export type Category = {
  id: string | number;
  name: string;
  description: string;
  icon?: string;
};

export async function fetchCategories(): Promise<{
  data?: Category[];
  error?: string;
  loading?: boolean;
}> {
  try {
    const data = await apiGet<Category[]>("/api/categories/");
    return { data };
  } catch (error) {
    if (error instanceof ApiClientError) {
      return { error: error.message };
    }
    return { error: "Unable to load categories" };
  }
}
