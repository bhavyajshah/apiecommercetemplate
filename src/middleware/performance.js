const compression = require('compression');

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
};

const performanceMiddleware = compression({
  filter: shouldCompress,
  level: 6,
  threshold: 100 * 1024, // 100kb
  windowBits: 15,
  memLevel: 8
});

module.exports = performanceMiddleware;