const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'js.stripe.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'api.stripe.com'],
      frameSrc: ["'self'", 'js.stripe.com'],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false
});

const createAdvancedLimiter = (options = {}) => rateLimit({
  windowMs: options.windowMs || 15 * 60 * 1000,
  max: options.max || 100,
  message: { error: options.message || 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user._id : req.ip;
  },
  skip: (req) => {
    return req.user?.role === 'admin';
  }
});

// Create a default API limiter
const apiLimiter = createAdvancedLimiter();

module.exports = {
  helmetMiddleware,
  createAdvancedLimiter,
  apiLimiter
};