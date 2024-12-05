const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false
  });
};

exports.apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100,
  'Too many requests from this IP, please try again after 15 minutes'
);

exports.authLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  5,
  'Too many login attempts from this IP, please try again after an hour'
);