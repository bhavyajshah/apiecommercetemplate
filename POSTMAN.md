# Template Marketplace API Documentation

## Table of Contents
1. [Setup](#setup)
2. [Authentication](#authentication)
3. [Templates](#templates)
4. [Reviews](#reviews)
5. [Cart](#cart)
6. [Orders](#orders)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)

## Setup

### Environment Variables
```json
{
  "BASE_URL": "http://localhost:3000/api",
  "TOKEN": "",
  "STRIPE_PUBLISHABLE_KEY": "your_stripe_publishable_key"
}
```

### Global Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{TOKEN}}"
}
```

## Authentication

### Register
```http
POST {{BASE_URL}}/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
}
```

**Response (201)**
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

### Login
```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "SecurePass123!"
}
```

### Refresh Token
```http
POST {{BASE_URL}}/auth/refresh-token
Content-Type: application/json

{
    "token": "current_refresh_token"
}
```

## Templates

### Get All Templates
```http
GET {{BASE_URL}}/templates

Query Parameters:
- page (default: 1)
- limit (default: 10)
- category (nextjs, reactjs, vuejs, angular, other)
- status (free, paid)
- minPrice
- maxPrice
- search
- sortBy (createdAt, price, downloads)
- sortOrder (asc, desc)
- featured (boolean)
```

### Create Template
```http
POST {{BASE_URL}}/templates
Content-Type: multipart/form-data

// Form Data
name: "Modern Next.js Template"
category: "nextjs"
description: "A comprehensive Next.js template..."
price: 29.99
type: "paid"
downloadUrl: "https://example.com/template.zip"
thumbnail: [File]
features: ["SSR", "SEO Optimized"]
tags: ["nextjs", "react"]
compatibility: {
  "frameworks": ["Next.js 13+"],
  "browsers": ["Chrome", "Firefox"],
  "nodeVersion": ">=14"
}
```

### Update Template
```http
PUT {{BASE_URL}}/templates/:id
Content-Type: multipart/form-data

// Form Data (all fields optional)
name: "Updated Template Name"
price: 39.99
thumbnail: [File]
features: ["Feature 1", "Feature 2"]
```

### Delete Template
```http
DELETE {{BASE_URL}}/templates/:id
```

### Restore Template (Admin)
```http
POST {{BASE_URL}}/templates/:id/restore
```

## Reviews

### Add Review
```http
POST {{BASE_URL}}/reviews/:templateId

{
    "rating": 5,
    "comment": "Excellent template!"
}
```

### Get Template Reviews
```http
GET {{BASE_URL}}/reviews/template/:templateId?page=1&limit=10
```

### Update Review
```http
PUT {{BASE_URL}}/reviews/:reviewId

{
    "rating": 4,
    "comment": "Updated review"
}
```

### Delete Review
```http
DELETE {{BASE_URL}}/reviews/:reviewId
```

## Cart

### Get Cart
```http
GET {{BASE_URL}}/cart
```

### Add to Cart
```http
POST {{BASE_URL}}/cart/add

{
    "templateId": "template_id",
    "quantity": 1
}
```

### Update Cart Item
```http
PUT {{BASE_URL}}/cart/update/:templateId

{
    "quantity": 2
}
```

### Remove from Cart
```http
DELETE {{BASE_URL}}/cart/remove/:templateId
```

### Clear Cart
```http
DELETE {{BASE_URL}}/cart/clear
```

## Orders

### Create Order
```http
POST {{BASE_URL}}/orders

{
    "templates": [
        { "templateId": "template_id" }
    ]
}
```

### Process Payment
```http
POST {{BASE_URL}}/orders/:orderId/pay

{
    "paymentMethodId": "pm_card_visa"
}
```

### Get Order History
```http
GET {{BASE_URL}}/orders?page=1&limit=10
```

### Get Order Details
```http
GET {{BASE_URL}}/orders/:orderId
```

## Error Handling

All error responses follow this format:
```json
{
    "error": "Error message",
    "details": [
        {
            "field": "email",
            "message": "Invalid email format"
        }
    ]
}
```

Common Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Rate Limiting

### API Endpoints
- 100 requests per 15 minutes
- Headers returned:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

### Authentication Endpoints
- 5 attempts per hour
- Headers returned:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

## Testing Examples

### Complete Purchase Flow
1. Register/Login
```http
POST {{BASE_URL}}/auth/login
{
    "email": "john@example.com",
    "password": "SecurePass123!"
}
```

2. Browse Templates
```http
GET {{BASE_URL}}/templates?category=nextjs&status=paid
```

3. Add to Cart
```http
POST {{BASE_URL}}/cart/add
{
    "templateId": "template_id",
    "quantity": 1
}
```

4. Create Order
```http
POST {{BASE_URL}}/orders
{
    "templates": [
        { "templateId": "template_id" }
    ]
}
```

5. Process Payment
```http
POST {{BASE_URL}}/orders/:orderId/pay
{
    "paymentMethodId": "pm_card_visa"
}
```

### Template Management Flow
1. Create Template
```http
POST {{BASE_URL}}/templates
// Form data with template details and image
```

2. Update Template
```http
PUT {{BASE_URL}}/templates/:id
// Updated template information
```

3. Add Review
```http
POST {{BASE_URL}}/reviews/:templateId
{
    "rating": 5,
    "comment": "Great template!"
}
```

## Environment-Specific Settings

### Development
```json
{
    "BASE_URL": "http://localhost:3000/api",
    "STRIPE_PUBLISHABLE_KEY": "pk_test_..."
}
```

### Production
```json
{
    "BASE_URL": "https://api.yourservice.com/api",
    "STRIPE_PUBLISHABLE_KEY": "pk_live_..."
}
```