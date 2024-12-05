const rateLimit = require('express-rate-limit');
const logger = require('../../utils/logger');

const createAdvancedLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: { error: options.message || 'Too many requests' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user ? req.user._id : req.ip,
    skip: (req) => req.user?.role === 'admin',
    handler: (req, res) => {
      logger.warn('Rate limit exceeded:', {
        ip: req.ip,
        userId: req.user?._id,
        path: req.path
      });
      res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil(options.windowMs / 1000)
      });
    }
  });
};

const apiLimiter = createAdvancedLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP'
});

const authLimiter = createAdvancedLimiter({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 3600000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_ATTEMPTS) || 5,
  message: 'Too many authentication attempts'
});

module.exports = {
  createAdvancedLimiter,
  apiLimiter,
  authLimiter
};