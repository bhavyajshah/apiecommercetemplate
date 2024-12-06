# Template Marketplace API Documentation

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [Authentication](#authentication)
3. [Templates](#templates)
4. [Reviews](#reviews)
5. [Cart](#cart)
6. [Orders](#orders)
7. [Error Handling](#error-handling)

## Environment Setup

### Variables
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

### Register User
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

**Response (200)**
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

### Refresh Token
```http
POST {{BASE_URL}}/auth/refresh-token
Content-Type: application/json

{
    "token": "current_refresh_token"
}
```

**Response (200)**
```json
{
    "token": "new_jwt_token",
    "expiresIn": "24h"
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

**Example Request**
```http
GET {{BASE_URL}}/templates?page=1&limit=10&category=nextjs&minPrice=0&maxPrice=100&sortBy=price&sortOrder=asc
```

**Response (200)**
```json
{
    "docs": [
        {
            "_id": "template_id",
            "name": "Modern Next.js Template",
            "category": "nextjs",
            "price": 29.99,
            "thumbnailUrl": "https://example.com/thumbnail.jpg",
            "type": "paid",
            "averageRating": 4.5,
            "numberOfReviews": 10,
            "downloads": 150,
            "author": {
                "_id": "author_id",
                "name": "John Doe"
            }
        }
    ],
    "totalDocs": 100,
    "limit": 10,
    "totalPages": 10,
    "page": 1,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
}
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

**Response (201)**
```json
{
    "_id": "template_id",
    "name": "Modern Next.js Template",
    "category": "nextjs",
    "price": 29.99,
    "thumbnailUrl": "https://example.com/thumbnail.jpg",
    "features": ["SSR", "SEO Optimized"],
    "tags": ["nextjs", "react"],
    "type": "paid",
    "author": "user_id",
    "createdAt": "2023-12-06T12:00:00.000Z"
}
```

### Update Template
```http
PUT {{BASE_URL}}/templates/:id
Content-Type: multipart/form-data

// Form Data
name: "Updated Template Name"
price: 39.99
thumbnail: [File]
features: ["Feature 1", "Feature 2"]
```

**Response (200)**
```json
{
    "_id": "template_id",
    "name": "Updated Template Name",
    "price": 39.99,
    "features": ["Feature 1", "Feature 2"],
    "updatedAt": "2023-12-06T12:00:00.000Z"
}
```

## Reviews

### Add Review
```http
POST {{BASE_URL}}/reviews/:templateId
Content-Type: application/json

{
    "rating": 5,
    "comment": "Excellent template with great features!"
}
```

**Response (201)**
```json
{
    "_id": "review_id",
    "rating": 5,
    "comment": "Excellent template with great features!",
    "user": {
        "_id": "user_id",
        "name": "John Doe"
    },
    "template": "template_id",
    "createdAt": "2023-12-06T12:00:00.000Z"
}
```

### Get Template Reviews
```http
GET {{BASE_URL}}/reviews/template/:templateId?page=1&limit=10
```

**Response (200)**
```json
{
    "reviews": [
        {
            "_id": "review_id",
            "rating": 5,
            "comment": "Excellent template!",
            "user": {
                "_id": "user_id",
                "name": "John Doe"
            },
            "createdAt": "2023-12-06T12:00:00.000Z"
        }
    ],
    "totalPages": 5,
    "currentPage": 1
}
```

## Cart

### Get Cart
```http
GET {{BASE_URL}}/cart
```

**Response (200)**
```json
{
    "_id": "cart_id",
    "user": "user_id",
    "items": [
        {
            "template": {
                "_id": "template_id",
                "name": "Modern Next.js Template",
                "price": 29.99,
                "thumbnailUrl": "https://example.com/thumbnail.jpg"
            },
            "quantity": 1
        }
    ],
    "totalAmount": 29.99
}
```

### Add to Cart
```http
POST {{BASE_URL}}/cart/add
Content-Type: application/json

{
    "templateId": "template_id",
    "quantity": 1
}
```

### Update Cart Item
```http
PUT {{BASE_URL}}/cart/update/:templateId
Content-Type: application/json

{
    "quantity": 2
}
```

## Orders

### Create Order
```http
POST {{BASE_URL}}/orders
Content-Type: application/json

{
    "templates": [
        { "templateId": "template_id" }
    ]
}
```

**Response (201)**
```json
{
    "order": {
        "_id": "order_id",
        "user": "user_id",
        "templates": [
            {
                "template": "template_id",
                "price": 29.99
            }
        ],
        "totalAmount": 29.99,
        "paymentStatus": "pending",
        "createdAt": "2023-12-06T12:00:00.000Z"
    },
    "clientSecret": "stripe_client_secret"
}
```

### Process Payment
```http
POST {{BASE_URL}}/orders/:orderId/pay
Content-Type: application/json

{
    "paymentMethodId": "pm_card_visa"
}
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

### Common Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Testing Examples

### Complete Purchase Flow

1. Login
```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

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
Content-Type: application/json

{
    "templateId": "template_id",
    "quantity": 1
}
```

4. Create Order
```http
POST {{BASE_URL}}/orders
Content-Type: application/json

{
    "templates": [
        { "templateId": "template_id" }
    ]
}
```

5. Process Payment
```http
POST {{BASE_URL}}/orders/:orderId/pay
Content-Type: application/json

{
    "paymentMethodId": "pm_card_visa"
}
```

### Template Management Flow

1. Create Template
```http
POST {{BASE_URL}}/templates
Content-Type: multipart/form-data

// Form data
name: "Next.js E-commerce Template"
category: "nextjs"
description: "Complete e-commerce solution built with Next.js"
price: 49.99
type: "paid"
features: ["SSR", "Cart Management", "Admin Dashboard"]
tags: ["nextjs", "ecommerce", "typescript"]
thumbnail: [File]
```

2. Update Template
```http
PUT {{BASE_URL}}/templates/:id
Content-Type: multipart/form-data

// Form data
name: "Updated Template Name"
price: 59.99
features: ["New Feature 1", "New Feature 2"]
```

3. Add Review
```http
POST {{BASE_URL}}/reviews/:templateId
Content-Type: application/json

{
    "rating": 5,
    "comment": "Outstanding template with excellent documentation!"
}
```