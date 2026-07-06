export function resolveProfileImageUrl(
  value: string | null | undefined,
): string | null {
  const raw = value?.trim();
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) return raw;

  if (raw.startsWith("/")) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) return raw;
    try {
      return new URL(raw, base).toString();
    } catch {
      return raw;
    }
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
