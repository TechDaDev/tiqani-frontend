import { describe, expect, it, vi, afterEach } from "vitest";
import {
  getProfileInitials,
  getProfileImageSource,
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

  it("builds backend URLs for raw avatar storage paths", () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.test/api");

    expect(
      resolveProfileImageUrl("users/avatars/cba950718d49_ZEkVmgt.png"),
    ).toBe(
      "https://api.example.test/media/users/avatars/cba950718d49_ZEkVmgt.png",
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

  it("prefers avatar aliases before legacy profile image fields", () => {
    expect(
      getProfileImageSource({
        avatar_url: "https://api.example.test/media/avatar-url.png",
        avatar: "users/avatars/avatar.png",
        profile_image_url: "https://api.example.test/media/profile-url.png",
        profile_image: "/media/profile.png",
        profileImage: "/media/profile-image.png",
        image: "/media/image.png",
      }),
    ).toBe("https://api.example.test/media/avatar-url.png");
  });

  it("falls back through profile image aliases", () => {
    expect(
      getProfileImageSource({
        avatar_url: "",
        avatar: null,
        profile_image_url: "",
        profile_image: "users/avatars/fallback.png",
      }),
    ).toBe("users/avatars/fallback.png");
  });
});

describe("auth profile image mapping", () => {
  it("prefers avatar_url from current user responses", () => {
    const user = mapCurrentUserData({
      id: "user-1",
      username: "profile_user",
      first_name: "Profile",
      last_name: "User",
      role: "client",
      email: "profile@example.test",
      avatar_url: "https://api.example.test/media/avatar-url.png",
      avatar: "users/avatars/avatar.png",
      profile_image_url: "https://api.example.test/media/profile-url.png",
      profile_image: "/media/profile.png",
      is_active: true,
    });

    expect(user.profileImage).toBe(
      "https://api.example.test/media/avatar-url.png",
    );
  });

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

  it("keeps raw avatar storage paths from login responses for URL resolution", () => {
    const user = mapLoginUserData({
      id: "user-1",
      username: "profile_user",
      role: "technician",
      full_name: "Profile User",
      avatar: "users/avatars/cba950718d49_ZEkVmgt.png",
    });

    expect(user.profileImage).toBe("users/avatars/cba950718d49_ZEkVmgt.png");
  });
});
