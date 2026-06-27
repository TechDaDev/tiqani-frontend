# Phase 11 Frontend

Implemented vertical slices:
- Review domain modules under `lib/reviews`.
- Reputation domain modules under `lib/reputation`.
- Notification domain modules under `lib/notifications`.
- Same-origin proxy routes for review eligibility, review create/report, reputation, notifications, preferences, and staff moderation.
- Review creation page.
- Notification center page.
- Notification preference page.
- Public user reviews/reputation page.
- Staff review report page.
- Protected navigation notification entry with unread polling.

Validation:
- `npx tsc --noEmit`: passed.
- `npx vitest run`: 559 passed.
- `npm run lint`: passed with existing warnings.
- `npm run build`: passed with existing warnings.
- Focused Playwright review/notification gate: 11 passed across 5 spec files.

Focused Playwright command:

`CI=1 PLAYWRIGHT_HTML_OPEN=never NEXT_DIST_DIR=.next-e2e npx playwright test e2e/reviews e2e/notifications --workers=2 --retries=0 --reporter=line`

Known warnings:
- `next lint` deprecation.
- Existing hook dependency warnings in admin/dispute/funding pages.
- Existing unused eslint-disable warnings in `lib/api/browser-client.ts`.
- Full Playwright regression remains deferred; Phase 11 focused vertical workflow is covered.
