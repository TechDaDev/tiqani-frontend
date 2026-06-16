# Phase 5.2 — Messaging Playwright Closure

## Branch
`frontend/phase-5-2-messaging-closure`

## Summary
Final closure of Phase 5 messaging: fixed hidden-tab polling visibility, resolved all Playwright E2E messaging tests (29/29), fixed React "too many re-renders" bug, and extended backend seed fixtures.

## Changes

### 1. Hidden-tab Polling Fix
**File**: `lib/messages/query.ts`
- `useUnreadCount` updated with `visibilitychange` listener
- Polling pauses when `document.visibilityState === "hidden"`, resumes with immediate fetch when visible
- Unit tests: 12 tests for polling behavior (visible/hidden/resume/401/403)

### 2. React "Too many re-renders" Fix (Critical Bug)
**Root cause**: Several hooks called `fetch()` inline during component render instead of inside `useEffect()`. This caused React's infinite re-render detection.

**Files fixed**:
- `lib/messages/query.ts`: `useConversations`, `useConversationDetail`, `useMessages`, `useRequestConversation`
  - Changed from `if (data === undefined && !error && isLoading) { fetch(); }` to `useEffect(() => { fetch(); }, [fetch]);`
- `lib/requests/query.ts`: `useClientRequests`, `useClientRequestDetail`, `useTechnicianRequests`, `useTechnicianRequestDetail`
  - Same pattern fix

**Impact**: Fixed "Something went wrong" error on all messaging and requests pages.

### 3. Playwright Test Selector Fixes
**Files**: `e2e/messages/logout.spec.ts`, `e2e/messages/localization.spec.ts`
- `logout.spec.ts`: Changed logout button selector from `getByRole("button", { name: /log out/i })` to `nav:has(a[href*="/messages"]) button` (the old pattern didn't match Arabic "تسجيل الخروج")
- `localization.spec.ts`: Changed English login button from `getByRole("button", { name: /login/i })` to `button[type="submit"]` (English page says "Sign in", not "Login")

### 4. Backend Seed Extension
**File**: `tiqani_V3/accounts/management/commands/seed_e2e_fixtures.py`
- Added Room 3 for `technician` (e2e_technician) user — previously only `approved_technician` and `second_approved` had rooms
- Added `tech_profile` and `tech_user` lookup alongside existing profiles
- Room 3: Client A + Technician C with 2 sample messages

## Test Results

### Unit Tests (Vitest)
- **423 tests passing** across 37 files
- No regressions

### Playwright E2E — Messaging Suite
- **29/29 passing**
- All 9 spec files: client conversations, technician conversations, send message, unread badge, localization (3 locales), logout (2 tests), request linkage (2 tests), responsive, security

### Playwright E2E — Other Suites
- auth: 13/13 passing
- marketplace: 15/15 passing
- requests: 15/15 passing

### Quality Gates
- Lint: 0 warnings, 0 errors
- TypeScript: clean (no errors)
- Production build: succeeds
- Dependency audit: clean

## Files Changed
```
Frontend:
  M lib/messages/query.ts              (4 hooks fixed: inline fetch → useEffect)
  M lib/requests/query.ts              (4 hooks fixed: inline fetch → useEffect)
  M e2e/messages/localization.spec.ts  (English login selector)
  M e2e/messages/logout.spec.ts        (Logout button selector)
  
Backend:
  M accounts/management/commands/seed_e2e_fixtures.py  (Added Room 3 for technician)
```

## Git Branches
- Frontend: `frontend/phase-5-2-messaging-closure`
- Backend: `backend/phase-5-secure-messaging`
