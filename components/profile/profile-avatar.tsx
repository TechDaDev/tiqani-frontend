/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import {
  getProfileInitials,
  resolveProfileImageUrl,
} from "@/lib/profile/profile-image";

type ProfileAvatarProps = {
  src?: string | null;
  name?: string | null;
  username?: string | null;
  sizeClassName?: string;
  className?: string;
  iconFallback?: boolean;
};

export function ProfileAvatar({
  src,
  name,
  username,
  sizeClassName = "h-20 w-20",
  className = "",
  iconFallback = false,
}: ProfileAvatarProps) {
  const resolvedSrc = resolveProfileImageUrl(src);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(resolvedSrc && failedSrc !== resolvedSrc);

  useEffect(() => {
    setFailedSrc(null);
  }, [resolvedSrc]);

  return (
    <div
      data-testid="profile-avatar"
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary-soft font-bold text-primary ${sizeClassName} ${className}`}
    >
      {showImage ? (
        <img
          src={resolvedSrc ?? ""}
          alt={name || username || "Profile image"}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailedSrc(resolvedSrc)}
        />
      ) : iconFallback ? (
        <ImageIcon
          data-testid="profile-avatar-icon-fallback"
          className="h-8 w-8 text-foreground-muted"
        />
      ) : (
        <span data-testid="profile-avatar-initials" className="text-current">
          {getProfileInitials(name, username)}
        </span>
      )}
    </div>
  );
}
