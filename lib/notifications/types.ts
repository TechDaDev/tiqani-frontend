export interface NotificationItem {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  actor: string | null;
  actor_name: string | null;
  target_type: string;
  target_id: string | null;
  target_url: string;
  title_key: string;
  body_key: string;
  metadata: Record<string, unknown>;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationPreferences {
  offers: boolean;
  contracts: boolean;
  payments: boolean;
  execution: boolean;
  messages: boolean;
  disputes: boolean;
  refunds: boolean;
  reviews: boolean;
  security: boolean;
  system: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}
