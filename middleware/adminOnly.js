const db = require('../config/db');
const message = require('../constants/messages')

const adminOnly = async (req, res, next) => {
  const user = req.user;

  if (!user || !user.userId) {
    return res.status(401).json({ message: message.AUTHOR_NO_LOGIN });
  }

  try {
    const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [user.userId]);

    if (rows.length === 0 || rows[0].role !== 'admin') {
      return res.status(403).json({ message: message.FORBIDEN_ACCESS });
    }

    next();
  } catch (err) {
    console.error(message.ERROR_CHECK_ROLE_ADMIN, err);
    res.status(500).json({ message: message.SEVER_ERROR_ROLE });
  }
};

module.exports = adminOnly;
