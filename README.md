# Template Marketplace API

A robust RESTful API for an e-commerce platform specializing in selling coding templates. Built with Node.js, Express.js, and MongoDB.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Secure password hashing with bcrypt

- 🛍️ **Template Management**
  - CRUD operations for templates
  - Categories: Next.js, React.js, Vue.js, Angular, and more
  - Search and filter capabilities
  - Pagination support

- 🛒 **Shopping Cart**
  - Add/remove templates
  - Update quantities
  - Calculate totals automatically
  - Persistent cart storage

- 💳 **Payment Processing**
  - Secure payments via Stripe
  - Webhook integration for payment status updates
  - Order history tracking

- 📝 **Reviews & Ratings**
  - User reviews for templates
  - Star rating system
  - Average rating calculation
  - One review per user per template

- 📧 **Email Notifications**
  - Order confirmations
  - Password reset emails
  - SendGrid integration

- 🚀 **Performance & Security**
  - Redis caching
  - Rate limiting
  - Request logging
  - Input validation
  - Error handling
  - CORS support
  - Helmet security headers

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- Redis for caching
- JWT for authentication
- Stripe for payments
- SendGrid for emails
- Winston for logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis
- Stripe account
- SendGrid account

## Environment Variables

Create a \`.env\` file in the root directory:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/template-marketplace
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
REDIS_URL=redis://localhost:6379
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@templatemarketplace.com
SENDGRID_ORDER_TEMPLATE_ID=your_order_template_id
SENDGRID_RESET_TEMPLATE_ID=your_reset_template_id
FRONTEND_URL=http://localhost:3000
PORT=3000
\`\`\`

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Templates

- GET `/api/templates` - List all templates (with pagination)
- GET `/api/templates/:id` - Get template details
- POST `/api/templates` - Create new template (Admin)
- PUT `/api/templates/:id` - Update template (Admin)
- DELETE `/api/templates/:id` - Delete template (Admin)

### Cart

- GET `/api/cart` - Get user's cart
- POST `/api/cart/add` - Add item to cart
- PUT `/api/cart/update/:templateId` - Update cart item
- DELETE `/api/cart/remove/:templateId` - Remove item from cart
- DELETE `/api/cart/clear` - Clear cart

### Orders

- POST `/api/orders` - Create new order
- GET `/api/orders` - Get user's orders
- POST `/api/orders/webhook` - Stripe webhook endpoint

### Reviews

- POST `/api/reviews/:templateId` - Create review
- GET `/api/reviews/template/:templateId` - Get template reviews
- PUT `/api/reviews/:reviewId` - Update review
- DELETE `/api/reviews/:reviewId` - Delete review

## Query Parameters

### Templates Endpoint

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `search` - Search in name and description

### Reviews Endpoint

- `page` - Page number (default: 1)
- `limit` - Reviews per page (default: 10)

## Error Handling

The API uses consistent error response format:

```json
{
  "error": "Error message here"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Rate Limiting

- API endpoints: 100 requests per 15 minutes
- Authentication endpoints: 5 attempts per hour

## Caching

- Template listings cached for 1 hour
- Individual template details cached for 1 hour
- Cache automatically invalidated on template updates

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Security headers with Helmet
- Request logging

## Testing

Run tests with:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License