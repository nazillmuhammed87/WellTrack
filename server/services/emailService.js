const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../utils/logger');

// In development, log emails to console instead of sending
const sendEmail = async ({ to, subject, html }) => {
  try {
    if (config.nodeEnv === 'development') {
      logger.info(`[EMAIL] To: ${to}, Subject: ${subject}`);
      logger.debug(`[EMAIL] Body: ${html}`);
      return { messageId: 'dev-' + Date.now() };
    }

    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    });

    const info = await transporter.sendMail({
      from: '"WellTrack" <noreply@welltrack.com>',
      to,
      subject,
      html
    });

    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email send failed: ${error.message}`);
  }
};

module.exports = { sendEmail };
