const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 100,
  minPoolSize: 10,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  w: 'majority'
};

// Retry strategy with exponential backoff
const connectWithRetry = async (retries = 5, delay = 1000) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    logger.info('MongoDB connected successfully');
    
    // Monitor connection events
    mongoose.connection.on('error', err => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    // Monitor performance
    mongoose.connection.on('query', (query) => {
      if (query.executionTime > 1000) {
        logger.warn('Slow query detected:', {
          operation: query.operation,
          collection: query.collection,
          executionTime: query.executionTime,
          query: query.query
        });
      }
    });

  } catch (error) {
    if (retries === 0) {
      logger.error('MongoDB connection failed after all retries:', error);
      process.exit(1);
    }
    
    logger.warn(`MongoDB connection attempt failed. Retrying in ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return connectWithRetry(retries - 1, delay * 2);
  }
};

module.exports = connectWithRetry;