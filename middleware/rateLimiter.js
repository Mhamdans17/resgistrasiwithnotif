const rateLimit = require('express-rate-limit');
const message = require('../constants/messages');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: message.AUTH.MESSAGE_LIMITER,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
