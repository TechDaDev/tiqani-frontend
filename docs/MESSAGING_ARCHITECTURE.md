# Messaging Architecture

## Overview

Secure messaging enables clients and technicians to communicate within the context of a service request. Architecture is built on RESTful principles with server-side authentication enforcement.

## Components

### Frontend (Next.js)

```
app/[locale]/(protected)/messages/
  page.tsx                    → ConversationListPage
  conversation-list-page.tsx  → Client component, renders ConversationList
  [conversationId]/
    page.tsx                  → Server component, passes ID to detail
    conversation-detail-page.tsx → Client component with messages

components/messages/
  conversation-list.tsx        → List of conversations with loading/error/empty states
  conversation-list-item.tsx   → Single conversation row with unread badge
  conversation-header.tsx      → Back button, participant info, status
  message-thread.tsx           → Message list with load-older and auto-scroll
  message-bubble.tsx           → Individual message with alignment and styling
  message-composer.tsx         → Text input with send button, validation
  unread-badge.tsx             → Circular count badge

lib/messages/
  types.ts                     → TypeScript interfaces
  schemas.ts                   → Zod validation schemas
  mappers.ts                   → snake_case → camelCase mapping
  query.ts                     → React hooks for API calls
```

### Backend (Django REST Framework)

```
chat/
  models.py                    → ServiceChatRoom, ServiceChatMessage, ServiceChatReadState
  serializers.py               → Room, Message, Unread serializers
  views.py                     → REST API views
  urls.py                      → URL configuration
  services.py                  → Business logic
  permissions.py               → Participant authorization
  consumers.py                 → WebSocket consumer (backend only)
```

## Data Flow

1. User opens conversation list → `useConversations()` hook → proxy route → Django list
2. User opens conversation → `useConversationDetail()` + `useMessages()` → proxy routes → Django detail + messages
3. User sends message → `useSendMessage()` → proxy POST → Django create message
4. User opens conversation → `useMarkRead()` → proxy POST → Django mark-read
5. Unread polling → `useUnreadCount()` → proxy GET → Django unread-summary (30s interval)

## Key Design Decisions

- **REST polling instead of WebSocket**: Simplifies frontend, avoids connection management. Adequate for 30-second update intervals.
- **Proxy routes**: All API calls go through Next.js route handlers. HTTP-only cookies handle authentication. Backend tokens never exposed to JavaScript.
- **Optimistic sends**: Message appears after backend confirmation (no true optimistic UI).
- **Read on open**: Mark-read fires when conversation detail loads with unread count > 0.
- **Best-effort read state**: Mark-read failures are silently ignored.
