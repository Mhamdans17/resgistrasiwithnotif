const jwt = require('jsonwebtoken');
const message = require('../constants/messages');
const responseCode = require('../constants/responsecode');
const secretKey = process.env.JWT_SECRET;
const { createClient } = require('redis');

// Inisialisasi Redis client
const redisClient = createClient();
redisClient.connect().catch(console.error);

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: message.AUTH.TOKEN_NOTFOUND,
    responseCode: responseCode.UNAUTHORIZED});
  }

  const token = authHeader.split(' ')[1];

  try {
    // Cek apakah token sudah di-blacklist di Redis
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: message.AUTH.TOKEN_BLACKLIST,
      responseCode: responseCode.UNAUTHORIZED});
    }

    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: message.AUTH.IVALIDE_TOKEN,
        responseCode: responseCode.UNAUTHORIZED });
  }
};

module.exports = auth;