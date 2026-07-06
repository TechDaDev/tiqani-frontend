export type ProfileImageFields = {
  avatar_url?: unknown;
  avatar?: unknown;
  profile_image_url?: unknown;
  profile_image?: unknown;
  profileImage?: unknown;
  image?: unknown;
};

const RAW_AVATAR_PATH_PREFIXES = ["users/avatars/"];

function getBackendBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    process.env.BACKEND_INTERNAL_URL ||
    null
  );
}

function buildBackendUrl(path: string) {
  const base = getBackendBaseUrl();
  if (!base) return path;

  try {
    return new URL(path, base).toString();
  } catch {
    return path;
  }
}

export function getProfileImageSource(
  value: ProfileImageFields | null | undefined,
): string | null {
  if (!value) return null;

  const candidates = [
    value.avatar_url,
    value.avatar,
    value.profile_image_url,
    value.profile_image,
    value.profileImage,
    value.image,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const raw = candidate.trim();
    if (raw) return raw;
  }

  return null;
}

export function resolveProfileImageUrl(value: unknown): string | null {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) return raw;

  if (raw.startsWith("/")) {
    return buildBackendUrl(raw);
  }

  if (RAW_AVATAR_PATH_PREFIXES.some((prefix) => raw.startsWith(prefix))) {
    return buildBackendUrl(`/media/${raw}`);
  }

  return null;
}

export function getProfileInitials(
  name: string | null | undefined,
  username?: string | null,
) {
  const source = (name || username || "").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source[0].toUpperCase();
}
