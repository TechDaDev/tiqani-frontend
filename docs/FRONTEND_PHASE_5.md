# Phase 5 — Secure Messaging Frontend

## Overview

Phase 5 adds request-linked secure messaging between clients and technicians. Conversations are scoped to a single service request. Arbitrary user-to-user chat is not supported.

## Features

- **Conversation list** — `/messages` shows all conversations for the authenticated user.
- **Conversation detail** — `/messages/[id]` shows message history with composer.
- **Message sending** — Text messages only (attachments, price offers deferred).
- **Unread state** — Per-room unread count with total badge in navigation.
- **Read state** — Opening a conversation marks incoming messages as read.
- **Request linkage** — One conversation per service request.
- **Polling** — 30-second REST polling for unread count.

## Architecture

```
Browser → Next.js Proxy Routes → Django REST API → PostgreSQL
```

All requests go through same-origin proxy routes (`/api/messages/*`) which authenticate via HTTP-only cookies and proxy to the Django backend. No tokens are exposed to JavaScript.

## Proxy Routes

| Frontend Route | Method | Backend Route | Purpose |
|---|---|---|---|
| `/api/messages/conversations/` | GET | `/api/chat/rooms/` | List conversations |
| `/api/messages/conversations/` | POST | `/api/chat/rooms/` | Create conversation |
| `/api/messages/conversations/:id/` | GET | `/api/chat/rooms/:id/` | Conversation detail |
| `/api/messages/conversations/:id/messages/` | GET | `/api/chat/rooms/:id/messages/` | List messages |
| `/api/messages/conversations/:id/messages/send/` | POST | `/api/chat/rooms/:id/messages/send/` | Send message |
| `/api/messages/conversations/:id/mark-read/` | POST | `/api/chat/rooms/:id/mark-read/` | Mark read |
| `/api/messages/by-request/:id/` | GET | `/api/chat/rooms/by-request/:id/` | Get/create for request |
| `/api/messages/by-request/:id/` | POST | `/api/chat/rooms/by-request/:id/` | Create for request |
| `/api/messages/unread-count/` | GET | `/api/chat/rooms/unread-summary/` | Unread summary |

## Navigation

- Messages link is visible for authenticated `client` and `technician` users.
- Link routes to `/{locale}/messages`.
- Unread count badge displays next to the Messages link in navigation.
- Badge hidden when count is zero.
- Badge displays `99+` for counts above 99.
- No duplicate entries in navigation.
- No link for anonymous users.

## Polling Strategy

- **Interval**: 30 seconds.
- **Start**: On mount of `AuthShell` when user is authenticated.
- **Stop**: On unmount of `AuthShell`.
- **Tab visibility**: Polling continues regardless of tab visibility (no `visibilitychange` handling yet).
- **Logout**: Polling stops via `useEffect` cleanup.
- **Errors**: Silent fail on network errors; no infinite retry loop.
- **Auth failures**: Polling silently fails on 401/403 (no retry).
- **Deduplication**: Message deduplication is not needed for polling since unread count is aggregated, not per-message.

## Security

- Conversations are restricted to participants.
- Cross-client access returns 404.
- Sender is always the authenticated user (cannot spoof).
- Private fields (email, phone) are not included in participant summaries.
- Message body is rendered as plain text (no HTML).
- Anonymous access redirects to login.

## Limitations

- No WebSocket frontend integration (backend WebSocket exists but frontend polling-only).
- No file attachments in messages.
- No price offers or contract linking from chat UI.
- No push notifications.
- Read state does not update in real-time across devices.
