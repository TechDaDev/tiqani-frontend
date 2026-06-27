import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  notification_type: z.string(),
  title: z.string(),
  message: z.string(),
  actor: z.string().uuid().nullable().optional(),
  actor_name: z.string().nullable().optional(),
  target_type: z.string(),
  target_id: z.string().uuid().nullable().optional(),
  target_url: z.string(),
  title_key: z.string().optional().default(""),
  body_key: z.string().optional().default(""),
  metadata: z.record(z.unknown()).default({}),
  is_read: z.boolean(),
  read_at: z.string().nullable().optional(),
  created_at: z.string(),
});

export const NotificationPreferencesSchema = z.object({
  offers: z.boolean(),
  contracts: z.boolean(),
  payments: z.boolean(),
  execution: z.boolean(),
  messages: z.boolean(),
  disputes: z.boolean(),
  refunds: z.boolean(),
  reviews: z.boolean(),
  security: z.boolean(),
  system: z.boolean(),
  email_enabled: z.boolean().default(false),
  push_enabled: z.boolean().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
