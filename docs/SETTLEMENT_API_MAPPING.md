# Settlement API Mapping

## Backend -> Frontend Proxy

| Backend Endpoint | Frontend Proxy Route | Method | Purpose |
|---|---|---|---|
| `/api/wallet/contracts/{id}/settlement/eligibility/` | `/api/contracts/{id}/settlement/eligibility/` | GET | Check settlement eligibility |
| `/api/wallet/contracts/{id}/settlements/` | `/api/contracts/{id}/settlements/` | POST | Create settlement (release escrow) |
| `/api/wallet/contracts/{id}/settlement/` | `/api/contracts/{id}/settlement/` | GET | Get settlement details |
| `/api/wallet/contracts/{id}/financial-summary/` | `/api/contracts/{id}/financial-summary/` | GET | Get financial summary |
| `/api/wallet/me/` | `/api/wallet/me/` | GET | Get wallet info |
| `/api/wallet/transactions/` | `/api/wallet/transactions/` | GET | List wallet transactions |
| `/api/wallet/available-balance/` | `/api/wallet/available-balance/` | GET | Get available balance |
| `/api/wallet/withdrawals/` | `/api/wallet/withdrawals/` | GET/POST | List/create withdrawals |
| `/api/wallet/withdrawals/{id}/` | `/api/wallet/withdrawals/{id}/` | GET | Withdrawal detail |
| `/api/wallet/withdrawals/{id}/cancel/` | `/api/wallet/withdrawals/{id}/cancel/` | POST | Cancel withdrawal |
| `/api/wallet/admin/withdrawals/` | `/api/admin/withdrawals/` | GET | Staff withdrawal list |
| `/api/wallet/admin/withdrawals/{id}/approve/` | `/api/admin/withdrawals/{id}/approve/` | POST | Staff approve |
| `/api/wallet/admin/withdrawals/{id}/reject/` | `/api/admin/withdrawals/{id}/reject/` | POST | Staff reject |
| `/api/wallet/admin/withdrawals/{id}/process/` | `/api/admin/withdrawals/{id}/process/` | POST | Staff process |
| `/api/wallet/admin/withdrawals/{id}/sandbox-confirm/` | `/api/admin/withdrawals/{id}/sandbox-confirm/` | POST | Staff sandbox confirm |
| `/api/wallet/admin/withdrawals/{id}/retry/` | `/api/admin/withdrawals/{id}/retry/` | POST | Staff retry payout |

All proxies preserve HTTP-only cookie auth and backend status codes.
