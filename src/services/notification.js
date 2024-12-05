const sgMail = require('@sendgrid/mail');
const logger = require('../utils/logger');
const { redisClient } = require('../config/redis');

class NotificationService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.emailQueue = 'email_notifications';
  }

  async queueEmail(type, data) {
    try {
      const notification = {
        type,
        data,
        timestamp: new Date().toISOString()
      };

      await redisClient.rPush(this.emailQueue, JSON.stringify(notification));
      this.processEmailQueue();
    } catch (error) {
      logger.error('Failed to queue email', { error });
    }
  }

  async processEmailQueue() {
    try {
      const notification = await redisClient.lPop(this.emailQueue);
      if (!notification) return;

      const { type, data } = JSON.parse(notification);
      await this.sendEmail(type, data);
    } catch (error) {
      logger.error('Failed to process email queue', { error });
    }
  }

  async sendEmail(type, data) {
    const templates = {
      orderConfirmation: process.env.SENDGRID_ORDER_TEMPLATE_ID,
      passwordReset: process.env.SENDGRID_RESET_TEMPLATE_ID,
      welcomeEmail: process.env.SENDGRID_WELCOME_TEMPLATE_ID
    };

    try {
      const msg = {
        to: data.email,
        from: process.env.SENDGRID_FROM_EMAIL,
        templateId: templates[type],
        dynamic_template_data: data
      };

      await sgMail.send(msg);
      logger.info('Email sent successfully', { type, recipient: data.email });
    } catch (error) {
      logger.error('Email sending failed', { error, type, data });
      throw error;
    }
  }
}

module.exports = new NotificationService();