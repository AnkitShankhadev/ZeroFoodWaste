const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = require('../config/env');

/**
 * Simple email sending utility using Nodemailer
 * Configure your Gmail/SMTP credentials in environment variables.
 */
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.warn('📧 Email transporter not ready:', error.message);
  } else {
    console.log('📧 Email transporter is ready to send messages');
  }
});

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn('📧 EMAIL_USER or EMAIL_PASS not configured. Skipping email send.');
    return;
  }

  const mailOptions = {
    from: `"ZeroFoodWaste" <${EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmail,
};


