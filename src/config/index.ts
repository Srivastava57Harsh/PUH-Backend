require('dotenv').config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  port: parseInt(process.env.PORT) || 8080,

  databaseURL: process.env.MONGODB_URI,

  jwtSecret: process.env.JWT_SECRET,

  salt: parseInt(process.env.SALT || '10'),

  logs: {
    level: process.env.LOG_LEVEL || 'debug',
  },

  api: {
    prefix: '/api',
  },
};
