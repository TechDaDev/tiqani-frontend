import { describe, expect, it, vi, afterEach } from "vitest";
import {
  getProfileInitials,
  resolveProfileImageUrl,
} from "@/lib/profile/profile-image";
import { mapCurrentUserData, mapLoginUserData } from "@/lib/auth/types";

describe("profile image helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("keeps absolute profile image URLs unchanged", () => {
    expect(
      resolveProfileImageUrl("https://api.example.test/media/avatar.png"),
    ).toBe("https://api.example.test/media/avatar.png");
  });

  it("builds backend URLs for relative media paths", () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.test/api");

    expect(resolveProfileImageUrl("/media/profile/avatar.png")).toBe(
      "https://api.example.test/media/profile/avatar.png",
    );
  });

  it("rejects storage keys that are not browser-loadable URLs", () => {
    expect(resolveProfileImageUrl("profile_images/avatar.png")).toBeNull();
    expect(resolveProfileImageUrl("")).toBeNull();
    expect(resolveProfileImageUrl(null)).toBeNull();
  });

  it("builds initials from full name or username", () => {
    expect(getProfileInitials("Jane Doe")).toBe("JD");
    expect(getProfileInitials("", "technician")).toBe("T");
    expect(getProfileInitials(null, null)).toBe("?");
  });
});

describe("auth profile image mapping", () => {
  it("prefers profile_image_url from current user responses", () => {
    const user = mapCurrentUserData({
      id: "user-1",
      username: "profile_user",
      first_name: "Profile",
      last_name: "User",
      role: "client",
      email: "profile@example.test",
      profile_image: "/media/relative.png",
      profile_image_url: "https://api.example.test/media/absolute.png",
      is_active: true,
    });

    expect(user.profileImage).toBe(
      "https://api.example.test/media/absolute.png",
    );
  });

  it("prefers profile_image_url from login responses", () => {
    const user = mapLoginUserData({
      id: "user-1",
      username: "profile_user",
      role: "technician",
      full_name: "Profile User",
      profile_image: "/media/relative.png",
      profile_image_url: "https://api.example.test/media/absolute.png",
    });

    expect(user.profileImage).toBe(
      "https://api.example.test/media/absolute.png",
    );
  });
});
