# Messaging Security

## Security Matrix

| Requirement | Status | Enforcement |
|---|---|---|
| Client A cannot access Client B conversation | ✅ Proved | Backend `IsRoomParticipant` permission |
| Technician A cannot access Technician B conversation | ✅ Proved | Same permission class |
| Unrelated authenticated user receives safe 404 | ✅ Proved | `get_object_or_404` + permission check |
| Anonymous receives 401 or login redirect | ✅ Proved | `ProtectedRoute` + `IsAuthenticated` |
| Sender is always authenticated user | ✅ Proved | Backend derives sender from JWT, not request body |
| Sender spoofing request field is ignored/rejected | ✅ Proved | Backend ignores `sender` in request body |
| Participants cannot be modified | ✅ Proved | Room participants set on creation, never changed |
| Message body rendered as plain text | ✅ Proved | Frontend renders `safe_body` (no HTML) |
| Private contact data absent | ✅ Proved | `ChatUserSummary` excludes email, phone |
| Request-linked room cannot be created by unrelated user | ✅ Proved | Backend validates request ownership |
| One conversation per request enforced | ✅ Proved | Backend `get_or_create` pattern |
| Token exposure prevention | ✅ Proved | HTTP-only cookies, proxy routes |
| Rate limiting | ✅ Proved | Backend DRF throttling classes |

## Authentication

- All messaging endpoints require authentication.
- Frontend uses `ProtectedRoute` component to wrap messages pages.
- Proxy routes call `authenticateProxy` which validates the session cookie.
- Unauthenticated requests receive 401.

## Authorization

- `IsRoomParticipant` permission class ensures user is either the client or technician of the room.
- Non-participants receive 404 (not 403) to prevent participant enumeration.
- Only clients can create rooms.
- Only participants can send messages.

## Data Protection

- **Personal data**: Participant summaries exclude email, phone, password.
- **Message content**: Rendered as plain text. No HTML rendering.
- **Body logging**: No message body logging on the frontend proxy.
- **Tokens**: Access tokens are HTTP-only cookies. JavaScript never reads them.

## Rate Limiting

- Backend applies DRF throttling to messaging endpoints.
- Frontend does not bypass rate limits.
- 429 responses are propagated to the UI.

## IDOR Prevention

- All room lookups use UUIDs (not sequential IDs).
- Permission check verifies user is a participant before returning data.
- Cross-participant access returns 404.
