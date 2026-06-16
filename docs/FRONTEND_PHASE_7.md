# Frontend Phase 7 — Contract Funding

## Routes
- `/contracts/{id}/fund` — Client funding page

## API Proxies
- `GET /api/contracts/{id}/funding/eligibility/` → Django `/api/wallet/contracts/{id}/funding/eligibility/`
- `POST /api/contracts/{id}/funding/intents/` → Django `/api/wallet/contracts/{id}/funding/intents/`
- `GET /api/contracts/{id}/funding/status/` → Django `/api/wallet/contracts/{id}/funding/status/`
- `POST /api/payments/{id}/sandbox-confirm/` → Django `/api/wallet/payment-intents/{id}/sandbox-confirm/`

## Domain Modules
- `lib/payments/types.ts` — FundingEligibility, PaymentIntent, ContractFundingStatus
- `lib/payments/status.ts` — fundingStatusConfig, canStartFunding, isFundingTerminal
- `lib/payments/money.ts` — formatIQD, parseAmount
- `lib/api/payments.ts` — API client functions

## Components
- `components/payments/payment-status-badge.tsx` — Color-coded funding status
- `components/payments/funding-summary.tsx` — Funding details card
- `components/payments/funding-action.tsx` — Start funding button with loading state

## Localization
New namespaces: paymentStatus, funding, escrow, paymentErrors
