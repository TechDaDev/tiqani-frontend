# Phase 8: Contract Execution, Milestones, Deliverables & Completion

## Architecture

Contract execution is built on a state-machine model with four main workflows:

```
                    ┌─────────────┐
                    │   Pending   │
                    │  (Funded)   │
                    └──────┬──────┘
                           │ client activates
                           ▼
                    ┌─────────────┐
                    │  Active     │◄────── milestone management
                    │  (Escrow)   │        (client create/edit)
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
      ┌──────────┐ ┌──────────┐ ┌──────────┐
      │Milestone │ │Milestone │ │Milestone │ ...
      │ Pending  │→│ InProgress│→│ Submitted │
      └──────────┘ └──────────┘ └────┬─────┘
                                      │ client approves
                                      ▼
                              ┌──────────┐
                              │ Approved │
                              └──────────┘
              │
              │ all milestones approved
              ▼
      ┌─────────────┐
      │  Completion │
      │  Requested  │
      └──────┬──────┘
             │ client confirms
             ▼
      ┌─────────────┐
      │  Completed  │
      │ (Escrow held│
      │  —no payout)│
      └─────────────┘
```

## Key Constraint

> **No escrow release. No wallet credit. No payouts. No Phase 9.**

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/contracts/{id}/activate/` | Activate funded contract |
| GET | `/api/contracts/{id}/execution/eligibility/` | Check activation eligibility |
| GET | `/api/contracts/{id}/` | Contract detail |
| GET | `/api/contracts/{id}/milestones/` | List milestones |
| POST | `/api/contracts/{id}/milestones/` | Create milestone (client only) |
| POST | `/api/contracts/{id}/milestones/reorder/` | Reorder milestones |
| GET | `/api/milestones/{id}/` | Milestone detail |
| PATCH | `/api/milestones/{id}/` | Update milestone |
| POST | `/api/milestones/{id}/start/` | Start milestone (technician) |
| POST | `/api/milestones/{id}/submit/` | Submit deliverable |
| POST | `/api/milestones/{id}/approve/` | Approve milestone (client) |
| POST | `/api/milestones/{id}/revision/` | Request revision |
| GET | `/api/milestones/{id}/submissions/` | List submissions |
| GET | `/api/contracts/{id}/execution-history/` | Event history |
| POST | `/api/contracts/{id}/complete/` | Request completion (technician) |
| POST | `/api/contracts/{id}/confirm-completion/` | Confirm (client) |
| POST | `/api/contracts/{id}/reject-completion/` | Reject with reason |

## Frontend Components

| Component | File | Purpose |
|-----------|------|---------|
| `ExecutionPage` | `app/[locale]/(protected)/contracts/[contractId]/execution/page.tsx` | Main execution page |
| `MilestonesPage` | `app/[locale]/(protected)/contracts/[contractId]/milestones/page.tsx` | Milestone list |
| `MilestoneDetailPage` | `app/[locale]/(protected)/contracts/[contractId]/milestones/[milestoneId]/page.tsx` | Milestone detail |
| `HistoryPage` | `app/[locale]/(protected)/contracts/[contractId]/history/page.tsx` | Execution history |

### Supporting Components (in components/execution/)

- `ExecutionActions` — action buttons (activate, complete, confirm, reject)
- `ExecutionStatus` — status badge
- `MilestoneCard` — individual milestone display
- `MilestoneForm` — create/edit form
- `MilestoneList` — milestone collection
- `DeliverableSubmission` — file upload form
- `CompletionDialog` — completion request dialog
- `EscrowNotice` — escrow status display
- `HistoryTimeline` — event timeline

## E2E Test Coverage (117 tests, 15 spec files)

| Spec | Tests | Coverage |
|------|-------|----------|
| activation.spec.ts | 6 | Funded/unfunded activation, permissions, duplicate safety, persistence |
| completion-confirmation.spec.ts | 9 | Client confirm, tech cannot, duplicate, persistence, escrow/wallet checks |
| completion-rejection.spec.ts | 5 | Client reject, tech cannot, unrelated, persistence, history |
| completion-request.spec.ts | 4 | Tech request, client cannot, wrong tech, duplicate, persistence |
| deliverable-submission.spec.ts | 9 | Submit, validation, permissions, duplicate, versions, persistence |
| history.spec.ts | 8 | Order, sanitization, permissions, private data, internationalization |
| localization.spec.ts | 7 | LTR/RTL rendering, heading translation, status/escrow i18n |
| logout.spec.ts | 4 | Session clear, back-navigation, API-based logout |
| milestone-approval.spec.ts | 8 | Client approve, tech cannot, unrelated, without submission, persistence |
| milestone-management.spec.ts | 6 | Create, validate, permissions, sequence, persistence |
| permissions.spec.ts | 7 | Cross-client/tech boundaries, invalid UUIDs |
| responsive.spec.ts | 9 | Mobile/tablet/desktop viewports, overflow, touch targets |
| revision-flow.spec.ts | 6 | Client/tech revision, reasons, resubmission |
| security.spec.ts | 4 | Data isolation, API boundary tests |
| technician-progress.spec.ts | 5 | Milestone starting, permissions, persistence |

## Security Model

- **Contract isolation**: Users can only access contracts they're party to (client or assigned technician)
- **Role-based actions**: Only clients activate/approve/confirm; only technicians start milestones/submit deliverables
- **API-level enforcement**: Backend validates ownership and role on every endpoint
- **Escrow**: Remains held throughout — no payout or release controls exposed

## Localization

Supported locales: `en` (English), `ar` (Arabic), `ku` (Sorani Kurdish)

All execution UI text is translated via `next-intl` message files with keys in the `execution`, `milestones`, `deliverables`, `revisions`, and `completion` namespaces.

## Quality Gates

- TypeScript: `npx tsc --noEmit` → 0 errors
- Lint: `npx next lint` → 0 errors
- Unit tests: `npx vitest run` → 523 passed
- E2E serial: `npx playwright test e2e/execution/ --workers=1` → 117/117 passed
- Prior suites: 110/110 passed
