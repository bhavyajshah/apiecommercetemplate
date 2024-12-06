# Template Marketplace API - Postman Testing Guide

## Environment Setup

1. Create a new environment in Postman with these variables:

```json
{
  "BASE_URL": "http://localhost:3000/api",
  "TOKEN": ""
}
```

2. Import the collection into Postman
3. Select the created environment

## Authentication

### Register New User

```http
POST {{BASE_URL}}/auth/register
Content-Type: application/json

{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!"
}
```

**Response (201)**
```json
{
    "user": {
        "name": "Test User",
        "email": "test@example.com",
        "role": "user",
        "_id": "..."
    },
    "token": "...",
    "expiresIn": "24h"
}
```

### Login

```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "SecurePass123!"
}
```

**Response (200)**
```json
{
    "user": {
        "_id": "...",
        "name": "Test User",
        "email": "test@example.com",
        "role": "user"
    },
    "token": "...",
    "expiresIn": "24h"
}
```

After login, set the token in your environment:
1. In the response, copy the token value
2. Go to your environment
3. Set the TOKEN variable value
4. Save the environment

## Templates

### Get All Templates

```http
GET {{BASE_URL}}/templates
```

Query Parameters:
- `page` (default: 1)
- `limit` (default: 10)
- `category` (optional: nextjs, reactjs, vuejs, angular, other)
- `status` (optional: free, paid)
- `minPrice` (optional)
- `maxPrice` (optional)
- `search` (optional)
- `sortBy` (default: createdAt)
- `sortOrder` (default: desc)

**Response (200)**
```json
{
    "docs": [...],
    "totalDocs": 50,
    "limit": 10,
    "totalPages": 5,
    "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
}
```

### Get Template Details

```http
GET {{BASE_URL}}/templates/:id
```

**Response (200)**
```json
{
    "_id": "...",
    "name": "Modern Next.js Template",
    "category": "nextjs",
    "description": "...",
    "price": 29.99,
    "type": "paid",
    "features": ["SSR", "SEO Optimized"],
    "tags": ["nextjs", "react"],
    "author": {
        "_id": "...",
        "name": "Test User",
        "email": "test@example.com"
    },
    "reviews": [...]
}
```

### Create Template

```http
POST {{BASE_URL}}/templates
Authorization: Bearer {{TOKEN}}
Content-Type: multipart/form-data

// Form Data Fields
name: "Modern Next.js Template"
category: "nextjs"
description: "A comprehensive Next.js template..."
price: 29.99
type: "paid"
downloadUrl: "https://example.com/template.zip"
thumbnail: [File] // Image file (JPG, PNG, or GIF, max 5MB)
features: ["SSR Support", "SEO Optimized"]
tags: ["nextjs", "react"]
compatibility[frameworks][]: "Next.js 13+"
compatibility[browsers][]: "Chrome"
compatibility[browsers][]: "Firefox"
compatibility[nodeVersion]: ">=14"
```

**Response (201)**
```json
{
    "_id": "...",
    "name": "Modern Next.js Template",
    "thumbnailUrl": "https://your-bucket.s3.region.amazonaws.com/templates/image.jpg",
    ...
}
```

### Update Template

```http
PUT {{BASE_URL}}/templates/:id
Authorization: Bearer {{TOKEN}}
Content-Type: multipart/form-data

// Form Data Fields (all fields optional)
name: "Updated Next.js Template"
price: 39.99
thumbnail: [File]
features: ["SSR Support", "SEO Optimized", "New Feature"]
```

**Response (200)**
```json
{
    "_id": "...",
    "name": "Updated Next.js Template",
    ...
}
```

### Delete Template

```http
DELETE {{BASE_URL}}/templates/:id
Authorization: Bearer {{TOKEN}}
```

**Response (200)**
```json
{
    "message": "Template deleted successfully"
}
```

### Restore Template (Admin Only)

```http
POST {{BASE_URL}}/templates/:id/restore
Authorization: Bearer {{TOKEN}}
```

**Response (200)**
```json
{
    "message": "Template restored successfully"
}
```

### Upgrade to Paid

```http
POST {{BASE_URL}}/templates/:id/upgrade-to-paid
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "price": 29.99
}
```

**Response (200)**
```json
{
    "_id": "...",
    "type": "paid",
    "price": 29.99,
    ...
}
```

## Reviews

### Add Review

```http
POST {{BASE_URL}}/reviews/:templateId
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "rating": 5,
    "comment": "Excellent template with great features!"
}
```

### Get Template Reviews

```http
GET {{BASE_URL}}/reviews/template/:templateId
```

Query Parameters:
- `page` (default: 1)
- `limit` (default: 10)

### Update Review

```http
PUT {{BASE_URL}}/reviews/:reviewId
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "rating": 4,
    "comment": "Updated review comment"
}
```

### Delete Review

```http
DELETE {{BASE_URL}}/reviews/:reviewId
Authorization: Bearer {{TOKEN}}
```

## Cart Operations

### Get Cart

```http
GET {{BASE_URL}}/cart
Authorization: Bearer {{TOKEN}}
```

### Add to Cart

```http
POST {{BASE_URL}}/cart/add
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "templateId": "...",
    "quantity": 1
}
```

### Update Cart Item

```http
PUT {{BASE_URL}}/cart/update/:templateId
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "quantity": 2
}
```

### Remove from Cart

```http
DELETE {{BASE_URL}}/cart/remove/:templateId
Authorization: Bearer {{TOKEN}}
```

### Clear Cart

```http
DELETE {{BASE_URL}}/cart/clear
Authorization: Bearer {{TOKEN}}
```

## Orders

### Create Order

```http
POST {{BASE_URL}}/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "templates": [
        { "templateId": "..." }
    ]
}
```

**Response (201)**
```json
{
    "order": {
        "_id": "...",
        "templates": [...],
        "totalAmount": 29.99,
        "paymentStatus": "pending"
    },
    "clientSecret": "..." // Stripe payment intent client secret
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

Error responses follow this format:
```json
{
    "error": "Error message here"
}
```

## Rate Limiting

- API endpoints: 100 requests per 15 minutes
- Authentication endpoints: 5 attempts per hour

When rate limit is exceeded:
```json
{
    "error": "Too many requests",
    "retryAfter": 900
}
```

## Testing Tips

1. **Authentication Flow**
   - Register a new user
   - Login and save the token
   - Use token for authenticated requests

2. **Template Management**
   - Create template with image
   - Verify image upload
   - Update template details
   - Test search and filters

3. **Error Handling**
   - Test with invalid data
   - Test without authentication
   - Test with wrong permissions

4. **File Upload**
   - Test with various image types
   - Test with oversized files
   - Test with invalid file types