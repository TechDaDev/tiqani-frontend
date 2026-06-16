# Payments API Mapping — Phase 7

| Frontend Route | Method | Proxy File | Backend Endpoint | Response |
|---|---|---|---|---|
| `/api/contracts/{id}/funding/eligibility/` | GET | `app/api/contracts/[contractId]/funding/eligibility/route.ts` | `GET /api/wallet/contracts/{id}/funding/eligibility/` | eligibility + funding_status |
| `/api/contracts/{id}/funding/intents/` | POST | `app/api/contracts/[contractId]/funding/intents/route.ts` | `POST /api/wallet/contracts/{id}/funding/intents/` | PaymentIntent |
| `/api/contracts/{id}/funding/status/` | GET | `app/api/contracts/[contractId]/funding/status/route.ts` | `GET /api/wallet/contracts/{id}/funding/status/` | funding_status + escrow |
| `/api/payments/{id}/sandbox-confirm/` | POST | `app/api/payments/[paymentId]/sandbox-confirm/route.ts` | `POST /api/wallet/payment-intents/{id}/sandbox-confirm/` | payment_intent + provider_result |

All proxies use HTTP-only cookie auth, forward backend status codes, and never expose tokens or secrets.
