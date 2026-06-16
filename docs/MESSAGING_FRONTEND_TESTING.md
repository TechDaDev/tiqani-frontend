# Messaging Frontend Testing

## Test Coverage

### Vitest Unit/Integration Tests

| File | Tests | Coverage |
|---|---|---|
| `__tests__/api/messages-routes.test.ts` | 23 | Proxy route behavior, error handling, security |
| `__tests__/api/messages-domain.test.ts` | 32 | Schemas, mappers, private field stripping |
| `__tests__/components/messages/message-bubble.test.tsx` | 15 | Own/other, types, RTL, accessibility, XSS |
| `__tests__/components/messages/message-composer.test.tsx` | 16 | Send, validation, keyboard, pending state |
| `__tests__/components/messages/message-thread.test.tsx` | 8 | Loading, empty, messages, load older |
| `__tests__/components/messages/conversation-list.test.tsx` | 4 | Loading, error, empty, list |
| `__tests__/components/messages/conversation-list-item.test.tsx` | 7 | User info, preview, badge, accessibility |
| `__tests__/components/messages/conversation-header.test.tsx` | 6 | Header, back, status, role |
| `__tests__/components/messages/unread-badge.test.tsx` | 8 | Count display, 99+, hidden at 0, accessibility |
| `__tests__/navigation/messages-navigation.test.tsx` | 6 | Messages link, badge, route |

**Total: ~125 new Vitest tests**

### Playwright E2E Tests

| File | Tests | Coverage |
|---|---|---|
| `e2e/messages/client-conversations.spec.ts` | 6 | Client list, detail, send, reload, logout |
| `e2e/messages/technician-conversations.spec.ts` | 4 | Tech list, detail, send, reload |
| `e2e/messages/send-message.spec.ts` | 4 | Empty, input, send |
| `e2e/messages/unread.spec.ts` | 1 | Badge clears after read |
| `e2e/messages/request-link.spec.ts` | 2 | Client/tech request pages |
| `e2e/messages/security.spec.ts` | 4 | Cross-access, anonymous, redirect |
| `e2e/messages/localization.spec.ts` | 3 | Ar RTL, En LTR, Ku RTL |
| `e2e/messages/responsive.spec.ts` | 4 | 390px, 768px, 1024px, 1440px |
| `e2e/messages/logout.spec.ts` | 2 | Logout redirects list and detail |

**Total: ~30 new Playwright tests**

## Running Tests

```bash
# Vitest
npm run test

# Playwright (requires running backend + frontend)
npm run test:e2e

# Individual Playwright suites
npx playwright test e2e/messages
npx playwright test e2e/auth
npx playwright test e2e/marketplace
npx playwright test e2e/requests
```

## Test Fixtures

Backend fixtures via:
```bash
E2E_FIXTURE_PASSWORD='local-test-only' python manage.py seed_e2e_fixtures
```

Includes:
- 2 chat rooms with linked service requests
- 4 sample messages (client + technician)
- Read and unread conversations
- Cross-client conversations for security testing
