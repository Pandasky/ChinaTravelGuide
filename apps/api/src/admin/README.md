# Admin Module

The Admin module provides a comprehensive backend management system for the ChinaWise platform.

## Features

### Dashboard & Analytics
- Real-time statistics overview
- Revenue analytics (daily, weekly, monthly)
- Top-selling guides
- User growth tracking
- AI usage statistics

### User Management
- List all users with filtering
- Create new users
- Update user details
- Toggle admin status
- Bulk user actions (activate/deactivate/delete)
- View user details (orders, subscriptions, chats)

### Order Management
- View all orders with advanced filtering
- Update order status
- View order details
- Order statistics
- Recent orders list

### Guide Management
- CRUD operations for guides
- Bulk publish/unpublish
- Guide statistics
- Rating recalculation
- Category management (via Guides module)

### Content Management
- **FAQ Management**: Create, update, delete, reorder FAQs
- **Testimonials**: Manage customer testimonials
- **Site Settings**: Configure global site settings

## API Endpoints

All admin endpoints require:
- Valid JWT token
- Admin role (`isAdmin: true`)

### Dashboard
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/dashboard/stats` | GET | Get dashboard overview stats |
| `/api/admin/dashboard/analytics/revenue` | GET | Revenue analytics with date range |
| `/api/admin/dashboard/analytics/top-guides` | GET | Top selling guides |
| `/api/admin/dashboard/analytics/user-growth` | GET | User growth over time |
| `/api/admin/dashboard/analytics/ai-usage` | GET | AI usage statistics |

### User Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/users` | GET | List users (with filters) |
| `/api/admin/users/:id` | GET | Get user by ID |
| `/api/admin/users/:id/details` | GET | Get user with details |
| `/api/admin/users` | POST | Create new user |
| `/api/admin/users/:id` | PUT | Update user |
| `/api/admin/users/:id` | DELETE | Delete user |
| `/api/admin/users/bulk-action` | POST | Bulk user actions |
| `/api/admin/users/:id/toggle-admin` | POST | Toggle admin status |

### Order Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/orders` | GET | List orders (with filters) |
| `/api/admin/orders/:id` | GET | Get order details |
| `/api/admin/orders/stats/overview` | GET | Order statistics |
| `/api/admin/orders/recent/list` | GET | Recent orders |
| `/api/admin/orders/:id/status` | PUT | Update order status |

### Guide Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/guides` | GET | List guides |
| `/api/admin/guides/:id` | GET | Get guide details |
| `/api/admin/guides/stats/overview` | GET | Guide statistics |
| `/api/admin/guides` | POST | Create guide |
| `/api/admin/guides/:id` | PUT | Update guide |
| `/api/admin/guides/:id` | DELETE | Delete guide |
| `/api/admin/guides/bulk-publish` | POST | Bulk publish/unpublish |
| `/api/admin/guides/:id/update-rating` | POST | Recalculate rating |

### Content Management - FAQ
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/content/faqs` | GET | List all FAQs |
| `/api/admin/content/faqs` | POST | Create FAQ |
| `/api/admin/content/faqs/:id` | PUT | Update FAQ |
| `/api/admin/content/faqs/:id` | DELETE | Delete FAQ |
| `/api/admin/content/faqs/reorder` | POST | Reorder FAQs |

### Content Management - Testimonials
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/content/testimonials` | GET | List all testimonials |
| `/api/admin/content/testimonials` | POST | Create testimonial |
| `/api/admin/content/testimonials/:id` | PUT | Update testimonial |
| `/api/admin/content/testimonials/:id` | DELETE | Delete testimonial |
| `/api/admin/content/testimonials/reorder` | POST | Reorder testimonials |

### Content Management - Site Settings
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/content/settings` | GET | List all settings |
| `/api/admin/content/settings/:key` | GET | Get setting by key |
| `/api/admin/content/settings` | PUT | Update setting |
| `/api/admin/content/settings/:key` | DELETE | Delete setting |
| `/api/admin/content/settings/bulk` | POST | Bulk update settings |

## Authentication

Admin endpoints require:
1. Valid JWT token in `Authorization: Bearer <token>` header
2. User must have `isAdmin: true` flag

### Creating an Admin User

```bash
# Run the seed script which creates an admin user:
pnpm db:seed

# Default admin credentials:
# Email: admin@chinawise.com
# Password: admin123
```

Or manually promote a user to admin:

```http
POST /api/admin/users/{userId}/toggle-admin
Authorization: Bearer <admin_token>
```

## Filter Parameters

### Users
- `search`: Search by email or name
- `isAdmin`: Filter by admin status (`true`/`false`)
- `isActive`: Filter by active status (`true`/`false`)
- `sortBy`: Sort field (default: `createdAt`)
- `sortOrder`: `asc` or `desc`
- `page`: Page number
- `limit`: Items per page

### Orders
- `search`: Search by order number or user info
- `status`: Order status filter (`all`, `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`)
- `startDate`: Start date (ISO format)
- `endDate`: End date (ISO format)
- `userId`: Filter by user
- `guideId`: Filter by guide
- `page`: Page number
- `limit`: Items per page

### Guides
- `search`: Search by title, subtitle, or description
- `isPublished`: Filter by published status
- `isFree`: Filter by free/paid
- `categoryId`: Filter by category
- `page`: Page number
- `limit`: Items per page

## Response Format

All list endpoints return:

```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

## Error Handling

- `401 Unauthorized`: Invalid or missing JWT token
- `403 Forbidden`: User is not an admin
- `404 Not Found`: Resource not found
- `400 Bad Request`: Invalid request data
