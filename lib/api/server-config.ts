/**
 * Server-only configuration for backend-to-backend communication.
 * This file is never imported in client components.
 */
export const serverConfig = {
  backendInternalUrl: process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000",
  timeout: 10_000,
} as const;
