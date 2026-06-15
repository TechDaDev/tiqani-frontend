const SAFE_REDIRECT_PATTERNS = [
  /^\/(en|ar|ku)\//,
  /^\/(en|ar|ku)$/,
];

export function isSafeNextPath(path: string): boolean {
  try {
    const url = new URL(path, "http://localhost");
    // Only allow same-origin paths
    if (url.protocol === "http:" || url.protocol === "https:") {
      return false;
    }
    return SAFE_REDIRECT_PATTERNS.some((pattern) => pattern.test(path));
  } catch {
    return SAFE_REDIRECT_PATTERNS.some((pattern) => pattern.test(path));
  }
}

export function getStoredEmail(): string | null {
  try {
    return sessionStorage.getItem("tiqani_verify_email");
  } catch {
    return null;
  }
}

export function clearStoredEmail() {
  try {
    sessionStorage.removeItem("tiqani_verify_email");
  } catch {}
}
