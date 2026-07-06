import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { ProfileAvatar } from "@/components/profile/profile-avatar";

describe("ProfileAvatar", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders initials when no usable image is provided", () => {
    render(<ProfileAvatar name="Profile User" />);

    expect(screen.getByTestId("profile-avatar-initials")).toHaveTextContent(
      "PU",
    );
  });

  it("normalizes relative media image URLs against the backend origin", () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.test/api");

    render(
      <ProfileAvatar src="/media/profile/avatar.png" name="Profile User" />,
    );

    expect(screen.getByRole("img", { name: "Profile User" })).toHaveAttribute(
      "src",
      "https://api.example.test/media/profile/avatar.png",
    );
  });

  it("normalizes raw avatar storage paths against the backend media origin", () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.test/api");

    render(
      <ProfileAvatar
        src="users/avatars/cba950718d49_ZEkVmgt.png"
        name="Profile User"
      />,
    );

    expect(screen.getByRole("img", { name: "Profile User" })).toHaveAttribute(
      "src",
      "https://api.example.test/media/users/avatars/cba950718d49_ZEkVmgt.png",
    );
  });

  it("falls back after an image load error", () => {
    render(
      <ProfileAvatar
        src="https://api.example.test/media/profile/avatar.png"
        name="Profile User"
      />,
    );

    fireEvent.error(screen.getByRole("img", { name: "Profile User" }));

    expect(screen.getByTestId("profile-avatar-initials")).toHaveTextContent(
      "PU",
    );
  });

  it("can show an icon fallback for profile forms", () => {
    render(<ProfileAvatar iconFallback />);

    expect(screen.getByTestId("profile-avatar-icon-fallback")).toBeVisible();
  });
});
