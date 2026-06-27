import { browserClient } from "@/lib/api/browser-client";
import { mapReputation } from "@/lib/reputation/mappers";
import type { ReputationSnapshot } from "@/lib/reputation/types";

export async function fetchUserReputation(userId: string, role?: string): Promise<ReputationSnapshot> {
  const query = role ? `?role=${encodeURIComponent(role)}` : "";
  const data = await browserClient.get(`/api/users/${userId}/reputation${query}`);
  return mapReputation(data);
}
