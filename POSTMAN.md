# Template Marketplace API - Postman Testing Guide

## Setting Up Environment Variables

Create a new environment in Postman with these variables:

```json
{
  "BASE_URL": "http://localhost:3000/api",
  "TOKEN": ""
}
```

## Authentication APIs

### 1. Register User
```http
POST {{BASE_URL}}/auth/register
Content-Type: application/json

{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!"
}

Response 201:
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

### 2. Login
```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "SecurePass123!"
}

Response 200:
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

## Template APIs

### 1. Get All Templates
```http
GET {{BASE_URL}}/templates
Authorization: Bearer {{TOKEN}}

Query Parameters:
- page (default: 1)
- limit (default: 10)
- category (optional: nextjs, reactjs, vuejs, angular, other)
- status (optional: free, paid)
- minPrice (optional)
- maxPrice (optional)
- search (optional)
- sortBy (default: createdAt)
- sortOrder (default: desc)

Response 200:
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

### 2. Get Template Details
```http
GET {{BASE_URL}}/templates/:id
Authorization: Bearer {{TOKEN}}

Response 200:
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

### 3. Create Template
```http
POST {{BASE_URL}}/templates
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "name": "Modern Next.js Template",
    "category": "nextjs",
    "description": "A comprehensive Next.js template with advanced features...",
    "price": 29.99,
    "type": "paid",
    "downloadUrl": "https://example.com/template.zip",
    "thumbnailUrl": "https://example.com/thumbnail.jpg",
    "features": [
        "SSR Support",
        "SEO Optimized",
        "Responsive Design"
    ],
    "tags": ["nextjs", "react", "typescript"],
    "compatibility": {
        "frameworks": ["Next.js 13+"],
        "browsers": ["Chrome", "Firefox", "Safari"],
        "nodeVersion": ">=14"
    }
}

Response 201:
{
    "_id": "...",
    "name": "Modern Next.js Template",
    ...
}
```

### 4. Update Template
```http
PUT {{BASE_URL}}/templates/:id
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "name": "Updated Next.js Template",
    "price": 39.99,
    "features": [
        "SSR Support",
        "SEO Optimized",
        "Responsive Design",
        "New Feature"
    ]
}

Response 200:
{
    "_id": "...",
    "name": "Updated Next.js Template",
    ...
}
```

### 5. Delete Template
```http
DELETE {{BASE_URL}}/templates/:id
Authorization: Bearer {{TOKEN}}

Response 200:
{
    "message": "Template deleted successfully"
}
```

### 6. Restore Template (Admin Only)
```http
POST {{BASE_URL}}/templates/:id/restore
Authorization: Bearer {{TOKEN}}

Response 200:
{
    "message": "Template restored successfully"
}
```

### 7. Upgrade to Paid
```http
POST {{BASE_URL}}/templates/:id/upgrade-to-paid
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
    "price": 29.99
}

Response 200:
{
    "_id": "...",
    "type": "paid",
    "price": 29.99,
    ...
}
```

## Testing Flow

1. **Authentication Flow**
   - Register a new user
   - Login and save the token
   - Set the token in Postman environment

2. **Template Management Flow**
   - Create a new template
   - Get all templates
   - Get specific template details
   - Update template
   - Delete template
   - Restore template (admin only)
   - Upgrade free template to paid

3. **Error Handling Tests**
   - Try accessing protected routes without token
   - Submit invalid data
   - Access non-existent resources
   - Test pagination limits

## Common HTTP Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Testing Tips

1. **Environment Setup**
   - Use separate environments for development/testing
   - Keep tokens updated
   - Clear cache between tests

2. **Authentication**
   - Test token expiration
   - Test invalid tokens
   - Test missing tokens

3. **Data Validation**
   - Test required fields
   - Test field constraints
   - Test invalid data types

4. **Error Scenarios**
   - Test rate limiting
   - Test concurrent requests
   - Test large payloads