/**
 * Zod schemas for messaging domain validation.
 */

import { z } from "zod";

export const sendMessageSchema = z.object({
  body: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1, "Message cannot be empty").max(2000, "Message must be 2000 characters or less")),
});

export const conversationIdSchema = z.string().uuid("Invalid conversation ID");

export const requestIdSchema = z.string().uuid("Invalid request ID");

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
