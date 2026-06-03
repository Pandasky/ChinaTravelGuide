# Payment System - Phase 7

This payment system provides comprehensive payment processing capabilities for the ChinaWise platform.

## Features

### Payment Providers
- **Stripe** - Credit/Debit card payments (Visa, Mastercard, Amex)
- **PayPal** - PayPal account payments

### Payment Types
- **Guide Purchases** - One-time PDF guide purchases
- **Subscriptions** - AI assistant access (Daily/Weekly/Monthly plans)
- **Refunds** - Full and partial refunds

## API Endpoints

### Customer Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payment/methods` | GET | List available payment methods |
| `/api/payment/checkout` | POST | Create checkout session |
| `/api/payment/verify` | POST | Verify payment status |
| `/api/payment/refund` | POST | Request a refund |
| `/api/payment/invoices` | GET | List my invoices |
| `/api/payment/invoices/:orderId` | GET | Get invoice details |
| `/api/payment/invoices/:orderId/download` | GET | Download invoice HTML |

### Webhook Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payment/webhooks/stripe` | POST | Stripe webhook handler |
| `/api/payment/webhooks/paypal` | POST | PayPal webhook handler |

### Admin Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payment/admin/stats` | GET | Payment statistics |
| `/api/payment/admin/transactions` | GET | List all transactions |

## Request/Response Examples

### Create Checkout
```http
POST /api/payment/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "guide",
  "productId": "guide-uuid",
  "paymentMethod": "stripe",
  "successUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/cancel"
}
```

Response:
```json
{
  "checkoutUrl": "https://checkout.stripe.com/...",
  "sessionId": "cs_test_...",
  "provider": "stripe"
}
```

### Verify Payment
```http
POST /api/payment/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "provider": "stripe",
  "sessionId": "cs_test_..."
}
```

Response:
```json
{
  "status": "completed",
  "amount": 9.99,
  "currency": "USD",
  "paidAt": "2024-01-15T10:30:00Z"
}
```

### Request Refund
```http
POST /api/payment/refund
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order-uuid",
  "amount": 9.99,
  "reason": "Customer request"
}
```

## Environment Variables

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:5173
```

## Architecture

### Services
- **PaymentService** - Main orchestration service
- **StripeService** - Stripe-specific operations
- **PayPalService** - PayPal-specific operations
- **InvoiceService** - Invoice generation (HTML/PDF)
- **PaymentRetryService** - Background job for payment status sync

### Database Models
- **Order** - Purchase orders for guides
- **Subscription** - AI service subscriptions
- **PaymentTransaction** - All payment transactions with audit trail

### Cron Jobs
- **Every 5 minutes** - Check pending payments and update status
- **Daily at midnight** - Clean up old pending transactions (>7 days)

## Invoice Generation

Invoices are generated in HTML format and can be downloaded. PDF generation can be added using libraries like Puppeteer or PDFKit.

Invoice includes:
- Company information
- Customer details
- Itemized list
- Payment information
- Tax ID
- Professional formatting

## Error Handling

All errors are properly caught and logged. Failed payments are tracked with error messages for debugging.

## Security

- Webhook signatures are verified
- Raw body is used for webhook processing
- Admin endpoints require admin role
- Customer can only access their own data
