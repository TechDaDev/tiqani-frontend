# Phase 6 — Technician Offers, Client Approval, and Contract Initiation

## Backend Entity Names
- **Offer** model (`contract.offer_models.Offer`) — technician proposal linked to an accepted service request
- **Contract** model (existing `contract.models.Contract`) — minimal draft contract created on offer acceptance

## Backend Fields
### Offer
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| service_request | FK → ServiceRequest | The request this offer is for |
| amount | Decimal(12,2) | Always IQD, min 0.01 |
| currency | Char(3) | Fixed to "IQD", not user-editable |
| description | Text | Scope of work |
| duration_days | PositiveInteger (nullable) | Estimated duration |
| status | Char(20) | DRAFT → SUBMITTED → ACCEPTED/REJECTED/WITHDRAWN |
| created_at | DateTime | Auto |
| updated_at | DateTime | Auto |

### Contract (Phase 6 minimal)
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| client | FK → ClientProfile | From offer |
| technician | FK → TechnicianProfile | From offer |
| work_description | Text | Copied from offer |
| agreed_amount | Decimal | Copied from offer |
| currency | Char(3) | "IQD" |
| status | Char(50) | "draft" |
| client_accepted | Boolean | True |
| technician_accepted | Boolean | True |

## State Machine
```
DRAFT → SUBMITTED       (technician submits)
SUBMITTED → ACCEPTED    (client accepts → contract created atomically)
SUBMITTED → REJECTED    (client rejects)
SUBMITTED → WITHDRAWN   (technician withdraws)
```
Terminal states: ACCEPTED, REJECTED, WITHDRAWN

## Permissions
- Only the assigned technician can create/update/submit/withdraw an offer
- Only the request owner (client) can view/accept/reject
- Cross-client/technician access returns 404
- Anonymous access returns 401
- Offer acceptance is irreversible
- Duplicate acceptance returns 409 Conflict

## Atomic Contract Creation
- Offer acceptance creates a Contract atomically within a DB transaction
- Contract values (amount, description, parties) match the offer exactly
- Duplicate acceptance does NOT create duplicate contracts
- Contract status is "draft" with both client_accepted and technician_accepted

## Backend Endpoints
| Method | Path | Actor | Purpose |
|--------|------|-------|---------|
| GET | /api/technician/offers/ | Technician | List own offers |
| POST | /api/technician/offers/ | Technician | Create draft offer |
| GET | /api/technician/offers/:id/ | Technician | Offer detail |
| PATCH | /api/technician/offers/:id/ | Technician | Update draft |
| POST | /api/technician/offers/:id/submit/ | Technician | Submit offer |
| POST | /api/technician/offers/:id/withdraw/ | Technician | Withdraw offer |
| GET | /api/offers/ | Client | List incoming offers |
| GET | /api/offers/:id/ | Client | Offer detail |
| POST | /api/offers/:id/accept/ | Client | Accept → creates contract |
| POST | /api/offers/:id/reject/ | Client | Reject offer |
| GET | /api/offers/by-request/:rid/ | Both | List offers for request |

## Frontend Routes
| Route | Role | Purpose |
|-------|------|---------|
| /technician/offers | Technician | List own offers |
| /technician/offers/:id | Technician | Offer detail + actions |
| /technician/offers/new/:requestId | Technician | Create offer form |
| /offers | Client | List incoming offers |
| /offers/:id | Client | Offer detail + accept/reject |
| /contracts/:id | Both | Contract detail (read-only) |

## Quality Metrics
- **Backend tests**: 57 passing (models, API, contract creation)
- **Frontend tests**: 446 passing (23 new offer tests)
- **Lint**: 0 warnings, 0 errors
- **Type-check**: Passed
- **Build**: Passed

## Limitations (deferred to future phases)
- No wallet funding
- No escrow
- No payment capture
- No payment gateways
- No project execution stages
- No milestone payments
- No work completion
- No reviews/disputes
- No counteroffers
- No offer revision (superseding)
- No contract signatures/finalization
