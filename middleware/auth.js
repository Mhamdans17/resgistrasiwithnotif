const jwt = require('jsonwebtoken');
const message = require('../constants/messages');
const secretKey = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: message.TOKEN_NOTFOUND });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: message.IVALIDE_TOKEN });
  }
};

module.exports = auth;
