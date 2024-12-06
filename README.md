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



# Template Marketplace API Documentation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Redis
- Stripe Account
- SendGrid Account

### Installation Steps

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables in `.env`
4. Start the server:
```bash
npm run dev
```

## API Endpoints Documentation

### Authentication APIs

#### 1. Register User
- **Endpoint**: `POST /api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "StrongPass123!"
}
```
- **Response**:
```json
{
    "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
    },
    "token": "jwt_token",
    "expiresIn": "24h"
}
```

#### 2. Login
- **Endpoint**: `POST /api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
    "email": "john@example.com",
    "password": "StrongPass123!"
}
```
- **Response**:
```json
{
    "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
    },
    "token": "jwt_token",
    "expiresIn": "24h"
}
```

### Template APIs

#### 1. Get All Templates
- **Endpoint**: `GET /api/templates`
- **Headers**: `Authorization: Bearer your_token`
- **Query Parameters**:
  - page (default: 1)
  - limit (default: 10)
  - category (optional)
  - minPrice (optional)
  - maxPrice (optional)
  - search (optional)
- **Response**:
```json
{
    "templates": [{
        "_id": "template_id",
        "name": "Template Name",
        "category": "nextjs",
        "description": "Template description",
        "price": 29.99,
        "type": "paid",
        "averageRating": 4.5
    }],
    "totalPages": 5,
    "currentPage": 1
}
```

#### 2. Get Template Details
- **Endpoint**: `GET /api/templates/:id`
- **Headers**: `Authorization: Bearer your_token`
- **Response**:
```json
{
    "_id": "template_id",
    "name": "Template Name",
    "category": "nextjs",
    "description": "Detailed description",
    "price": 29.99,
    "type": "paid",
    "features": ["Feature 1", "Feature 2"],
    "tags": ["tag1", "tag2"],
    "author": {
        "_id": "author_id",
        "name": "Author Name"
    },
    "averageRating": 4.5,
    "numberOfReviews": 10,
    "reviews": [{
        "_id": "review_id",
        "rating": 5,
        "comment": "Great template!",
        "user": {
            "_id": "user_id",
            "name": "Reviewer Name"
        }
    }]
}
```

#### 3. Download Template
- **Endpoint**: `GET /api/templates/:id/download`
- **Headers**: `Authorization: Bearer your_token`
- **Response**:
```json
{
    "downloadUrl": "template_download_url"
}
```

### Cart APIs

#### 1. Get Cart
- **Endpoint**: `GET /api/cart`
- **Headers**: `Authorization: Bearer your_token`
- **Response**:
```json
{
    "_id": "cart_id",
    "items": [{
        "template": {
            "_id": "template_id",
            "name": "Template Name",
            "price": 29.99
        },
        "quantity": 1
    }],
    "totalAmount": 29.99
}
```

#### 2. Add to Cart
- **Endpoint**: `POST /api/cart/add`
- **Headers**:
  - `Authorization: Bearer your_token`
  - `Content-Type: application/json`
- **Body**:
```json
{
    "templateId": "template_id",
    "quantity": 1
}
```
- **Response**: Updated cart object

#### 3. Update Cart Item
- **Endpoint**: `PUT /api/cart/update/:templateId`
- **Headers**:
  - `Authorization: Bearer your_token`
  - `Content-Type: application/json`
- **Body**:
```json
{
    "quantity": 2
}
```
- **Response**: Updated cart object

#### 4. Remove from Cart
- **Endpoint**: `DELETE /api/cart/remove/:templateId`
- **Headers**: `Authorization: Bearer your_token`
- **Response**: Updated cart object

### Order APIs

#### 1. Create Order
- **Endpoint**: `POST /api/orders`
- **Headers**:
  - `Authorization: Bearer your_token`
  - `Content-Type: application/json`
- **Body**:
```json
{
    "templates": [{
        "templateId": "template_id"
    }]
}
```
- **Response**:
```json
{
    "order": {
        "_id": "order_id",
        "templates": [{
            "template": "template_id",
            "price": 29.99
        }],
        "totalAmount": 29.99,
        "paymentStatus": "pending"
    },
    "clientSecret": "stripe_client_secret"
}
```

### Review APIs

#### 1. Create Review
- **Endpoint**: `POST /api/reviews/:templateId`
- **Headers**:
  - `Authorization: Bearer your_token`
  - `Content-Type: application/json`
- **Body**:
```json
{
    "rating": 5,
    "comment": "Excellent template with great features!"
}
```
- **Response**:
```json
{
    "_id": "review_id",
    "rating": 5,
    "comment": "Excellent template with great features!",
    "user": {
        "_id": "user_id",
        "name": "Reviewer Name"
    },
    "template": "template_id",
    "createdAt": "2024-03-07T10:00:00.000Z"
}
```

#### 2. Get Template Reviews
- **Endpoint**: `GET /api/reviews/template/:templateId`
- **Query Parameters**:
  - page (default: 1)
  - limit (default: 10)
- **Response**:
```json
{
    "reviews": [{
        "_id": "review_id",
        "rating": 5,
        "comment": "Great template!",
        "user": {
            "_id": "user_id",
            "name": "Reviewer Name"
        },
        "createdAt": "2024-03-07T10:00:00.000Z"
    }],
    "totalPages": 2,
    "currentPage": 1
}
```

## Testing with Postman

1. **Environment Setup**:
   - Create a new environment in Postman
   - Add variables:
     - `baseUrl`: `http://localhost:3000`
     - `token`: Empty (will be filled after login)

2. **Collection Setup**:
   - Create a new collection
   - Add a pre-request script to automatically add the token:
   ```javascript
   if (pm.environment.get('token')) {
       pm.request.headers.add({
           key: 'Authorization',
           value: 'Bearer ' + pm.environment.get('token')
       });
   }
   ```

3. **Testing Flow**:
   1. Register a new user
   2. Login and save the token
   3. Browse templates
   4. Add templates to cart
   5. Create an order
   6. Add reviews

### Example Test Sequence

1. **Register**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
   -H "Content-Type: application/json" \
   -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "TestPass123!"
   }'
   ```

2. **Login**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{
       "email": "test@example.com",
       "password": "TestPass123!"
   }'
   ```

3. **Browse Templates**:
   ```bash
   curl -X GET "http://localhost:3000/api/templates?page=1&limit=10&category=nextjs" \
   -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Add to Cart**:
   ```bash
   curl -X POST http://localhost:3000/api/cart/add \
   -H "Authorization: Bearer YOUR_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{
       "templateId": "template_id",
       "quantity": 1
   }'
   ```

## Error Handling

The API uses consistent error response format:
```json
{
    "error": "Error message",
    "details": [] // Optional array of detailed error information
}
```

Common HTTP Status Codes:
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

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Security headers with Helmet
- Request logging

## Development Notes

1. For local development, ensure MongoDB and Redis are running
2. Use environment variables for configuration
3. Monitor logs for debugging
4. Use Postman collections for API testing
5. Follow security best practices

## Troubleshooting

1. **Connection Issues**:
   - Check MongoDB connection
   - Verify Redis connection
   - Ensure correct environment variables

2. **Authentication Issues**:
   - Verify token format
   - Check token expiration
   - Confirm user credentials

3. **Payment Issues**:
   - Verify Stripe configuration
   - Check webhook setup
   - Monitor payment logs