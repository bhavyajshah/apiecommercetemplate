const { redisClient } = require('../config/redis');

const CACHE_DURATION = 3600; // 1 hour in seconds

class CacheService {
  async get(key) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key, value, duration = CACHE_DURATION) {
    await redisClient.setEx(key, duration, JSON.stringify(value));
  }

  async del(key) {
    await redisClient.del(key);
  }

  async clearPattern(pattern) {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }
}

module.exports = new CacheService();