const logger = require('../utils/logger');
const { redisClient } = require('../config/redis');

class AnalyticsService {
  async trackEvent(eventType, data) {
    try {
      const event = {
        type: eventType,
        data,
        timestamp: new Date().toISOString()
      };

      await redisClient.rPush('analytics_events', JSON.stringify(event));
      logger.info('Analytics event tracked', { eventType, data });
    } catch (error) {
      logger.error('Analytics tracking failed', { error });
    }
  }

  async getTemplateStats(templateId) {
    try {
      const views = await redisClient.get(`template:${templateId}:views`) || 0;
      const downloads = await redisClient.get(`template:${templateId}:downloads`) || 0;
      
      return { views: parseInt(views), downloads: parseInt(downloads) };
    } catch (error) {
      logger.error('Failed to get template stats', { error });
      return { views: 0, downloads: 0 };
    }
  }
}

module.exports = new AnalyticsService();