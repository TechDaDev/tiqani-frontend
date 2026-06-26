# Phase 10 Playwright Locator Map

## Contract Dispute Page (`/contracts/{contractId}/dispute`)

| Element | Actual | Locator Strategy |
|---------|--------|-----------------|
| Heading | `t("openDispute")` = "Open Dispute" | `page.getByRole("heading", { name: /open dispute/i })` |
| Reason select | `<select>` element, label `t("reason")` = "Reason" | `page.getByRole("combobox", { name: /reason/i })` (implicit role for select) |
| Claimed Amount | `<input type="text">`, label `t("claimedAmount")` = "Claimed Amount" | `page.getByRole("textbox", { name: /claimed amount/i })` |
| Statement | `<textarea>`, label `t("statement")` = "Initial Statement", minLength=20 | `page.getByRole("textbox", { name: /initial statement/i })` |
| Submit button | `t("submitDispute")` = "Submit Dispute", disabled when submitting | `page.getByRole("button", { name: /submit dispute/i })` |
| Not eligible | `<div>` with text from `eligibility.reason` or `t("notEligible")` = "Not eligible to open a dispute" | `page.getByText(/not eligible/i)` |
| Active dispute exists | Yellow banner with `t("activeDisputeExists")`, status badge, "View Dispute" link | `page.getByText(/active dispute exists/i)` |

## Dispute List Page (`/disputes`)

| Element | Actual | Locator Strategy |
|---------|--------|-----------------|
| Heading | `t("title")` = "Disputes" | `page.getByRole("heading", { name: /disputes/i })` |
| Filter buttons | "All", "Open", "Under Review", "Resolved" | `page.getByRole("button", { name: /all/i })` |
| Dispute cards | `<Link>` elements | `page.locator("a").filter({ hasText: /open|under review/i })` |
| Empty state | `t("empty")` = "No disputes found." | `page.getByText(/no disputes found/i)` |

## Client Dispute Detail Page (`/disputes/{disputeId}`)

| Element | Actual | Locator Strategy |
|---------|--------|-----------------|
| Heading | `t("detailTitle")` = "Dispute Details" | `page.getByRole("heading", { name: /dispute details/i })` |
| Status badge | `getDisputeStatusLabel()` returns "Open", "Under Review", etc. | `page.getByText(/open|under review|resolved/i)` |
| Statements section | Heading "Statements" | `page.getByRole("heading", { name: /statements/i })` |
| Statement form | `<textarea>`, button `t("addStatement")` = "Add Statement" | `page.getByRole("button", { name: /add statement/i })` |
| Evidence section | Heading "Evidence" | `page.getByRole("heading", { name: /evidence/i })` |
| Timeline | `DisputeTimeline` component | `page.getByRole("heading", { name: /timeline/i })` - but rendered as event entries |
| Cancel button | `t("cancelDispute")` = "Cancel Dispute" (only for opener when status is open/awaiting_response) | `page.getByRole("button", { name: /cancel dispute/i })` |
| Confirm cancel | `t("confirmCancel")` = "Yes, Cancel Dispute" | `page.getByRole("button", { name: /yes, cancel dispute/i })` |

## Admin Dispute Queue (`/admin/disputes`)

| Element | Actual | Locator Strategy |
|---------|--------|-----------------|
| Heading | `t("queue")` = "Dispute Queue" | `page.getByRole("heading", { name: /dispute queue/i })` |
| Filter buttons | All, Open, Awaiting Response, Under Review, Resolution Proposed, Resolved, Rejected | `page.getByRole("button", { name: /open/i })` |
| Table | Contract reference, Opened By, Respondent, Reason, Amount, Status, Assigned, Actions | `page.locator("table")` |
| View link | `t("view")` = "View" | `page.getByRole("link", { name: /view/i })` |
| Empty state | `t("empty")` = "No disputes found." | `page.getByText(/no disputes found/i)` |

## Admin Dispute Detail (`/admin/disputes/{disputeId}`)

| Element | Actual | Locator Strategy |
|---------|--------|-----------------|
| Heading | `t("detailTitle")` = "Admin — Dispute Details" | `page.getByRole("heading", { name: /admin.*dispute details/i })` |
| Info grid | Opened By, Respondent, Reason, Claimed Amount | `page.locator(".grid")` |
| Assign button | `t("assignToMe")` = "Assign to Me" (visible only when `awaiting_response`) | `page.getByRole("button", { name: /assign to me/i })` |
| Start Review button | `t("startReview")` = "Start Review" (visible when `awaiting_response`) | `page.getByRole("button", { name: /start review/i })` |
| Mediation button | `t("resolveViaMediation")` = "Resolve via Mediation" (visible when `under_review`) | `page.getByRole("button", { name: /resolve via mediation/i })` |
| Propose Resolution button | `t("proposeResolution")` (visible when `mediation`) | `page.getByRole("button", { name: /propose resolution/i })` |
| Close Dispute button | `t("closeDispute")` = "Close Dispute" (visible when `closed`) | `page.getByRole("button", { name: /close dispute/i })` |
| Statements | Section heading | `page.getByRole("heading", { name: /statements/i })` |
| Evidence | Section heading | `page.getByRole("heading", { name: /evidence/i })` |
| Reconciliation panel | Section heading "Reconciliation" | `page.getByRole("heading", { name: /reconciliation/i })` |
| Audit timeline | Section heading "Audit History" | `page.getByRole("heading", { name: /audit history/i })` |

## Refund Detail Page (`/admin/refunds/{refundId}`)

| Element | Actual | Locator Strategy |
|---------|--------|-----------------|
| Heading | `t("detailTitle")` | `page.getByRole("heading", { name: /refund details/i })` |
| Sandbox confirm | `t("confirmRefund")` = "Confirm" (only when `pending`) | `page.getByRole("button", { name: /confirm/i })` |
| Failure message | `refund.failure_message` displayed in red | `page.locator("text-red-800")` |

## Chargeback List Page (`/admin/chargebacks`)

| Element | Actual | Locator Strategy |
|---------|--------|-----------------|
| Heading | `t("title")` | `page.getByRole("heading", { name: /chargebacks/i })` |
| Table | Contract, Amount, Reason, Status, Outcome, Actions | `page.locator("table")` |
| View link | `t("view")` | `page.getByRole("link", { name: /view/i })` |

## Chargeback Detail Page (`/admin/chargebacks/{chargebackId}`)

| Element | Actual | Locator Strategy |
|---------|--------|-----------------|
| Heading | `t("detailTitle")` | `page.getByRole("heading", { name: /chargeback details/i })` |
| Sandbox controls | Uphold, Reject, Partial buttons (only when `under_review`) | `page.getByRole("button", { name: /uphold/i })` |

## Key Locator Rules

1. **No eligibility panel exists on contract dispute page** - form renders directly when eligible
2. **`<select>` elements** use `getByRole("combobox")` not `getByRole("listbox")`
3. **Status labels** are hardcoded English strings (e.g., "Open", "Under Review") not translation keys
4. **Use `innerText()`** not `textContent("body")` to avoid RSC payload data
5. **Admin action buttons** are conditional on dispute status
6. **URL** for contract dispute is `/contracts/{id}/dispute` (singular), not `/disputes` (plural)
7. **Cancel tests** must wait for the `/api/disputes/{id}/cancel` response, assert exactly one visible cancel control before mutation, and verify repeated cancel leaves audit history unchanged.
