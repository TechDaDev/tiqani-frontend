"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AuthShell } from "@/components/profile/auth-shell";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <AuthShell>{children}</AuthShell>
    </ProtectedRoute>
  );
}
