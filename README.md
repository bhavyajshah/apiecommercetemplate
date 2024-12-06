# Template Marketplace API Documentation

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing Guide](#testing-guide)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## Overview

A robust RESTful API for an e-commerce platform specializing in selling coding templates. Built with Node.js, Express.js, and MongoDB, featuring advanced caching, security, and scalability features.

## Features

### Core Features
- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Secure password hashing with bcrypt
  - Rate limiting for security

- 🛍️ **Template Management**
  - CRUD operations with validation
  - Categories: Next.js, React.js, Vue.js, Angular
  - Advanced search and filtering
  - Pagination and sorting
  - Free and paid templates

- 💳 **Payment Processing**
  - Secure Stripe integration
  - Webhook handling
  - Payment status tracking
  - Refund management

- 📊 **Analytics & Monitoring**
  - Usage statistics
  - Performance monitoring
  - Error tracking
  - User behavior analytics

### Technical Features
- Redis caching for performance
- MongoDB with Mongoose ODM
- Express.js middleware architecture
- Winston logging system
- Input validation and sanitization
- Rate limiting and security headers
- CORS protection
- Comprehensive error handling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Redis (v6 or higher)
- Stripe Account
- SendGrid Account

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-username/template-marketplace-api.git
cd template-marketplace-api
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Configure environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

4. Start development server:
\`\`\`bash
npm run dev
\`\`\`

### Environment Variables

Required environment variables:

\`\`\`env
# Application
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/template-marketplace

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=24h
PASSWORD_SALT_ROUNDS=12

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_CURRENCY=usd

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@example.com
\`\`\`

## API Documentation

### Authentication

#### Register User
\`\`\`http
POST /api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
}
\`\`\`

#### Login
\`\`\`http
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "SecurePass123!"
}
\`\`\`

### Templates

#### Get All Templates
\`\`\`http
GET /api/templates?page=1&limit=10&category=nextjs&minPrice=0&maxPrice=100&search=react
Authorization: Bearer <token>
\`\`\`

#### Get Template Details
\`\`\`http
GET /api/templates/:id
Authorization: Bearer <token>
\`\`\`

#### Create Template
\`\`\`http
POST /api/templates
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Modern Next.js Template",
    "category": "nextjs",
    "description": "A feature-rich Next.js template...",
    "price": 29.99,
    "type": "paid",
    "features": ["SSR", "SEO Optimized"],
    "tags": ["nextjs", "react"]
}
\`\`\`

## Testing Guide

### Using Postman

1. Import the provided Postman collection
2. Set up environment variables
3. Run the authentication flow first
4. Test other endpoints with the received token

### Automated Testing

Run the test suite:
\`\`\`bash
npm test
\`\`\`

Run specific tests:
\`\`\`bash
npm test -- --grep "Template API"
\`\`\`

### Load Testing

Using Artillery:
\`\`\`bash
npm run test:load
\`\`\`

## Security

### Implemented Security Measures

1. **Authentication & Authorization**
   - JWT with secure configuration
   - Password hashing with bcrypt
   - Role-based access control

2. **API Security**
   - Rate limiting
   - Request validation
   - XSS protection
   - CSRF protection
   - Security headers

3. **Data Security**
   - Input sanitization
   - Secure password storage
   - Sensitive data encryption

### Best Practices

1. **API Security**
   - Use HTTPS in production
   - Implement proper CORS policy
   - Set secure HTTP headers
   - Rate limit sensitive endpoints

2. **Data Handling**
   - Validate all inputs
   - Sanitize user data
   - Use parameterized queries
   - Implement proper error handling

## Deployment

### Production Checklist

1. **Environment Setup**
   - Set NODE_ENV to 'production'
   - Configure production databases
   - Set up SSL certificates

2. **Security Measures**
   - Enable all security middleware
   - Configure rate limiters
   - Set up monitoring

3. **Performance Optimization**
   - Enable compression
   - Configure caching
   - Set up CDN if needed

### Monitoring

1. **Application Monitoring**
   - Error tracking
   - Performance metrics
   - Resource utilization

2. **Security Monitoring**
   - Failed login attempts
   - Rate limit breaches
   - Suspicious activities

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Code Style Guide

- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add tests for new features

## Troubleshooting

### Common Issues

1. **Connection Issues**
   - Check MongoDB connection string
   - Verify Redis connection
   - Confirm network connectivity

2. **Authentication Issues**
   - Verify JWT token
   - Check token expiration
   - Confirm user permissions

3. **Performance Issues**
   - Monitor Redis cache hits
   - Check database indexes
   - Review API response times

### Debug Mode

Enable debug logging:
\`\`\`bash
DEBUG=app:* npm run dev
\`\`\`

## License

MIT License - see LICENSE file for details