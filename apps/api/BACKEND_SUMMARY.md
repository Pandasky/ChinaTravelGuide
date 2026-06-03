# ChinaWise Backend - Implementation Summary

## Overview
Complete REST API backend for the ChinaWise travel guide platform built with NestJS, PostgreSQL, and Prisma.

## Project Structure

```
apps/api/src/
├── admin/              # Admin dashboard module
├── ai/                 # OpenRouter AI integration
├── auth/               # JWT authentication
├── common/             # Shared decorators, filters, interceptors
├── guides/             # Guide CRUD operations
├── payment/            # Stripe/PayPal payment processing
├── prisma/             # Database client
├── storage/            # Alibaba Cloud OSS
├── users/              # User management
├── app.module.ts       # Root module
└── main.ts             # Entry point
```

## Completed Phases

### Phase 6: Backend API Development ✅
- NestJS project setup with TypeScript
- Prisma ORM configuration
- Database schema design

### Phase 7: Payment System Integration ✅
- Stripe checkout and webhooks
- PayPal checkout and webhooks
- Payment transaction tracking
- Invoice generation
- Automatic payment retry mechanism

### Phase 8: Admin Dashboard ✅
- Dashboard statistics and analytics
- User management (CRUD, bulk actions)
- Order management
- Guide management
- Content management (FAQ, Testimonials, Settings)

## API Modules

### 1. Authentication (`/api/auth`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | User registration |
| `/auth/login` | POST | User login |
| `/auth/oauth` | POST | OAuth login (Google/Facebook/Apple) |
| `/auth/refresh` | POST | Refresh access token |
| `/auth/forgot-password` | POST | Request password reset |
| `/auth/reset-password` | POST | Reset password |
| `/auth/me` | GET | Get current user |

### 2. Users (`/api/user`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/user/profile` | GET | Get profile |
| `/user/profile` | PUT | Update profile |
| `/user/password` | PUT | Change password |
| `/user/guides` | GET | My guides |
| `/user/orders` | GET | My orders |
| `/user/subscriptions` | GET | My subscriptions |
| `/user/subscription/current` | GET | Current subscription |
| `/user/subscription/cancel` | POST | Cancel subscription |

### 3. Guides (`/api/guides`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/guides` | GET | List guides (public) |
| `/guides/categories` | GET | List categories |
| `/guides/:id` | GET | Guide details |
| `/guides/:id/preview` | GET | Guide preview |
| `/guides/:id/download` | GET | Download guide |
| `/guides/:id/reviews` | POST | Create review |

### 4. AI Chat (`/api/ai`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ai/sessions` | GET | Chat sessions |
| `/ai/sessions` | POST | Create session |
| `/ai/sessions/:id` | GET | Session details |
| `/ai/sessions/:id` | DELETE | Delete session |
| `/ai/chat` | POST | Send message |
| `/ai/chat/stream` | SSE | Stream message |
| `/ai/models` | GET | Available models |

### 5. Payment (`/api/payment`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/payment/methods` | GET | Payment methods |
| `/payment/checkout` | POST | Create checkout |
| `/payment/verify` | POST | Verify payment |
| `/payment/refund` | POST | Request refund |
| `/payment/invoices` | GET | My invoices |
| `/payment/invoices/:orderId` | GET | Invoice details |
| `/payment/invoices/:orderId/download` | GET | Download invoice |
| `/payment/webhooks/stripe` | POST | Stripe webhook |
| `/payment/webhooks/paypal` | POST | PayPal webhook |

### 6. Admin (`/api/admin`)

#### Dashboard
| Endpoint | Description |
|----------|-------------|
| `/admin/dashboard/stats` | Overview statistics |
| `/admin/dashboard/analytics/revenue` | Revenue analytics |
| `/admin/dashboard/analytics/top-guides` | Top guides |
| `/admin/dashboard/analytics/user-growth` | User growth |
| `/admin/dashboard/analytics/ai-usage` | AI usage stats |

#### User Management
| Endpoint | Description |
|----------|-------------|
| `/admin/users` | List users |
| `/admin/users/:id` | User details |
| `/admin/users/:id/details` | Full user details |
| `/admin/users` | Create user |
| `/admin/users/:id` | Update user |
| `/admin/users/:id` | Delete user |
| `/admin/users/bulk-action` | Bulk actions |
| `/admin/users/:id/toggle-admin` | Toggle admin |

#### Order Management
| Endpoint | Description |
|----------|-------------|
| `/admin/orders` | List orders |
| `/admin/orders/:id` | Order details |
| `/admin/orders/stats/overview` | Order stats |
| `/admin/orders/recent/list` | Recent orders |
| `/admin/orders/:id/status` | Update status |

#### Guide Management
| Endpoint | Description |
|----------|-------------|
| `/admin/guides` | List guides |
| `/admin/guides/:id` | Guide details |
| `/admin/guides` | Create guide |
| `/admin/guides/:id` | Update guide |
| `/admin/guides/:id` | Delete guide |
| `/admin/guides/bulk-publish` | Bulk publish |
| `/admin/guides/stats/overview` | Guide stats |

#### Content Management
| Endpoint | Description |
|----------|-------------|
| `/admin/content/faqs` | FAQ CRUD |
| `/admin/content/faqs/reorder` | Reorder FAQs |
| `/admin/content/testimonials` | Testimonial CRUD |
| `/admin/content/testimonials/reorder` | Reorder testimonials |
| `/admin/content/settings` | Site settings |

## Database Schema

### Core Models
- **User**: User accounts with OAuth support
- **Guide**: PDF travel guides
- **Category**: Guide categories (cities, themes, duration)
- **Order**: Guide purchase orders
- **Subscription**: AI service subscriptions
- **Review**: Guide reviews
- **ChatSession**: AI chat sessions
- **Message**: Chat messages
- **PaymentTransaction**: Payment tracking
- **FAQ**: Frequently asked questions
- **Testimonial**: Customer testimonials
- **SiteSetting**: Global site settings

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/chinawise"

# JWT
JWT_SECRET="your-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# OpenRouter AI
OPENROUTER_API_KEY="your-api-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# PayPal
PAYPAL_CLIENT_ID="..."
PAYPAL_CLIENT_SECRET="..."

# Alibaba Cloud OSS
ALIYUN_ACCESS_KEY_ID="..."
ALIYUN_ACCESS_KEY_SECRET="..."
ALIYUN_OSS_REGION="cn-hangzhou"
ALIYUN_OSS_BUCKET="chinawise"

# Frontend
FRONTEND_URL="http://localhost:5173"

# Server
PORT=3000
NODE_ENV="development"
```

## Scripts

```bash
# Development
pnpm dev:api              # Start dev server
pnpm db:generate          # Generate Prisma client
pnpm db:migrate           # Run migrations
pnpm db:studio            # Open Prisma Studio
pnpm db:seed              # Seed database

# Build
pnpm build:api            # Build for production
pnpm start:api            # Start production server
```

## Default Admin Account

```
Email: admin@chinawise.com
Password: admin123
```

Created automatically when running `pnpm db:seed`

## Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Admin role-based access control
- Webhook signature verification
- CORS configuration
- Helmet security headers
- Request validation with class-validator

## Background Jobs

- **Payment Retry**: Every 5 minutes
- **Transaction Cleanup**: Daily at midnight

## Next Steps

1. Run `pnpm db:seed` to initialize the database
2. Start the backend: `pnpm dev:api`
3. Access the API at: `http://localhost:3000/api`
4. Login as admin to access admin endpoints
5. Configure payment provider credentials
