# Messaging API Mapping

## Frontend-to-Backend Route Mapping

All frontend messaging routes proxy to backend Django endpoints through Next.js API route handlers.

### Conversations

| Frontend | Backend | Authentication |
|---|---|---|
| `GET /api/messages/conversations/` | `GET /api/chat/rooms/` | Required |
| `POST /api/messages/conversations/` | `POST /api/chat/rooms/` | Required (client only) |
| `GET /api/messages/conversations/:id/` | `GET /api/chat/rooms/:id/` | Required (participant) |

### Messages

| Frontend | Backend | Authentication |
|---|---|---|
| `GET /api/messages/conversations/:id/messages/` | `GET /api/chat/rooms/:id/messages/` | Required (participant) |
| `POST /api/messages/conversations/:id/messages/send/` | `POST /api/chat/rooms/:id/messages/send/` | Required (participant) |
| `POST /api/messages/conversations/:id/mark-read/` | `POST /api/chat/rooms/:id/mark-read/` | Required (participant) |

### Request-Linked

| Frontend | Backend | Authentication |
|---|---|---|
| `GET /api/messages/by-request/:id/` | `GET /api/chat/rooms/by-request/:id/` | Required |
| `POST /api/messages/by-request/:id/` | `POST /api/chat/rooms/by-request/:id/` | Required |

### Unread

| Frontend | Backend | Authentication |
|---|---|---|
| `GET /api/messages/unread-count/` | `GET /api/chat/rooms/unread-summary/` | Required |

## Response Shapes

### Conversation List Item

```json
{
  "id": "uuid",
  "status": "OPEN|PROPOSAL_CREATED|CONTRACT_LINKED|CLOSED|BLOCKED",
  "client_user": { "id": "uuid", "username": "str", "full_name": "str", "profile_image": "str|null", "role": "str" },
  "technician_user": { ... },
  "service_request_id": "uuid|null",
  "service_request_title": "str|null",
  "last_message_preview": { "id": "uuid", "message_type": "str", "preview": "str", "sender_id": "uuid", "created_at": "datetime" } | null,
  "unread_count": 0,
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Message

```json
{
  "id": "uuid",
  "room_id": "uuid",
  "sender": "uuid",
  "sender_info": { "id": "uuid", "username": "str", "full_name": "str", "role": "str" },
  "message_type": "TEXT|SYSTEM|FILE|PRICE_OFFER",
  "body": "str",
  "safe_body": "str",
  "is_deleted": false,
  "created_at": "datetime"
}
```

### Unread Summary

```json
{
  "total_unread": 5,
  "rooms": [{ "room_id": "uuid", "unread_count": 2 }]
}
```

## Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created (room or message) |
| 400 | Bad request (invalid data) |
| 401 | Not authenticated |
| 403 | Forbidden (not a participant, wrong role) |
| 404 | Not found (nonexistent room/request) |
| 409 | Conflict (blocked room, duplicate) |
| 429 | Rate limited |
| 500 | Server error |

## Participant Rules

- A conversation always has exactly two participants: one client and one technician.
- Only the client can create a conversation.
- A conversation is linked to exactly one service request.
- Only the request's participants can access the linked conversation.
- Sender is always the authenticated user (backend enforces this).
