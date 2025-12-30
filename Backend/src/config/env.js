require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://ankitshankhadev444:s0cXbLvN4hqAKPOr@fyp.midaupc.mongodb.net/database',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads/',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5242880, // 5MB
  MATCHING_RADIUS: process.env.MATCHING_RADIUS || 10, // km
};

