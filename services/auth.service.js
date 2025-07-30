const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const message = require('../constants/messages');

//Service activate email
exports.completeRegistrationService = async (email, password) => {
  const [userRows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (userRows.length === 0) throw { status: 400, message:  message.EMAIL_NOT_FOUND };

  const userId = userRows[0].id;

  const [authRows] = await db.query('SELECT id FROM user_auth WHERE user_id = ?', [userId]);
  if (authRows.length > 0) throw { status: 400, message: message.ACCOUNT_ALREADY_REGISTERED };

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    'INSERT INTO user_auth (user_id, password, is_active) VALUES (?, ?, ?)',
    [userId, hashedPassword, true]
  );

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return { message: message.REGISTRATION_SUCCESS};
};

//Service Login
exports.loginService = async (email, password) => {
  const [userRows] = await db.query('SELECT id, name, role FROM users WHERE email = ?', [email]);
  if (userRows.length === 0) {
    throw { status: 400, message: message.EMAIL_NOT_FOUND };
  }

  const user = userRows[0];

  const [authRows] = await db.query('SELECT password FROM user_auth WHERE user_id = ?', [user.id]);
  if (authRows.length === 0) {
    throw { status: 400, message: message.ACCOUNT_NOT_ACTIVE };
  }

  const isMatch = await bcrypt.compare(password, authRows[0].password);
  if (!isMatch) {
    throw { status: 400, message: message.INVALID_PASSWORD };
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return {
    message: message.LOGIN_SUCCESS,
    token,
    user: {
      id: user.id,
      name: user.name,
      email,
      role: user.role
    }
  };
};