# Payments Architecture — Phase 7

## Components

```
pages/client/contracts/[id]/
  └── page.tsx          ← Contract detail + funding integration

pages/client/contracts/[id]/fund/
  └── page.tsx          ← Funding page (eligibility → intent → sandbox confirm)

components/payments/
  ├── payment-status-badge.tsx  ← Color-coded funding status
  ├── funding-summary.tsx       ← Funding details card
  └── funding-action.tsx        ← Start funding button + error/success

lib/payments/
  ├── types.ts          ← TypeScript interfaces
  ├── status.ts         ← Status config, helpers
  ├── money.ts          ← IQD formatting
  └── schemas.ts        ← Zod validation

lib/api/payments.ts     ← API client
```

## Data Flow

```
Browser → Next.js API Proxy (HTTP-only cookie auth)
       → Django Backend (/api/wallet/...)
       → PaymentIntent model → Wallet → WalletTransaction → Contract
       → Response → Proxy → Browser
```
