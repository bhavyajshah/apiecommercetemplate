const sgMail = require('@sendgrid/mail');
const logger = require('../utils/logger');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  async sendOrderConfirmation(user, order) {
    try {
      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Order Confirmation - Template Marketplace',
        template_id: process.env.SENDGRID_ORDER_TEMPLATE_ID,
        dynamic_template_data: {
          name: user.name,
          orderId: order._id,
          templates: order.templates,
          totalAmount: order.totalAmount
        }
      };
      await sgMail.send(msg);
    } catch (error) {
      logger.error('Email sending failed:', error);
    }
  }

  async sendPasswordReset(user, resetToken) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      const msg = {
        to: user.email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Password Reset Request',
        template_id: process.env.SENDGRID_RESET_TEMPLATE_ID,
        dynamic_template_data: {
          name: user.name,
          resetUrl
        }
      };
      await sgMail.send(msg);
    } catch (error) {
      logger.error('Password reset email failed:', error);
    }
  }
}

module.exports = new EmailService();