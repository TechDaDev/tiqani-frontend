# Payments Security — Frontend

## Amount Authority
- Amount always derived from backend ContractPaymentBreakdown
- Browser never sends authoritative amount or currency
- Proxy routes strip any request body amount/currency fields

## Data Exposure
- `ContractFundingStatus` for technician: no `active_intent` details
- `PaymentIntent` serialized: no card/CVV/token/secret fields
- No provider secrets pass through proxies

## IDOR
- Backend enforces contract ownership
- Frontend routes require authentication
- Unauthorized users redirected to login
