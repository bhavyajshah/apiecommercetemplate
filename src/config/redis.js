const Redis = require('ioredis');
const logger = require('../utils/logger');

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB) || 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3
};

const redisClient = new Redis(redisConfig);

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected Successfully');
});

redisClient.on('ready', () => {
  logger.info('Redis Client Ready to Accept Commands');
});

redisClient.on('reconnecting', () => {
  logger.info('Redis Client Reconnecting...');
});

const connectRedis = async () => {
  try {
    await redisClient.ping();
    logger.info('Redis connection test successful');
  } catch (error) {
    logger.error('Redis connection test failed:', error);
    process.exit(1);
  }
};

module.exports = { redisClient, connectRedis };