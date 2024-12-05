const cacheService = require('../services/cache');

const cache = (duration) => {
  return async (req, res, next) => {
    const key = `${req.originalUrl || req.url}`;
    const cachedResponse = await cacheService.get(key);

    if (cachedResponse) {
      return res.json(JSON.parse(cachedResponse));
    }

    res.originalJson = res.json;
    res.json = async (body) => {
      await cacheService.set(key, body, duration);
      res.originalJson(body);
    };
    
    next();
  };
};

module.exports = cache;