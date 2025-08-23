const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const message = require('../constants/messages');
const crypto = require('crypto');

//Service activate email
exports.completeRegistrationService = async (email, password) => {
  const [userRows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (userRows.length === 0) throw { status: 400, message:  message.USER.EMAIL_NOT_FOUND };

  const userId = userRows[0].id;

  const [authRows] = await db.query('SELECT id FROM user_auth WHERE user_id = ?', [userId]);
  if (authRows.length > 0) throw { status: 400, message: message.USER.ACCOUNT_ALREADY_REGISTERED };

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    'INSERT INTO user_auth (user_id, password, is_active) VALUES (?, ?, ?)',
    [userId, hashedPassword, true]
  );

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return { message: message.USER.REGISTRATION_SUCCESS};
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

// Service: Lupa Password
exports.forgotPasswordService = async (email) => {
  const [userRows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (userRows.length === 0) throw { status: 400, message: message.EMAIL_NOT_FOUND };

  const userId = userRows[0].id;

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Token berlaku 1 jam

  // Cek apakah sudah ada token sebelumnya
  await db.query('DELETE FROM password_resets WHERE user_id = ?', [userId]);

  await db.query(
    'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  );

  // Return token untuk dikirim via email
  return {
    message: message.FORGOT_PASSWORD_TOKEN_CREATED,
    resetToken: token, // simulasikan dikirim via email
  };
};

// Service: Reset Password
exports.resetPasswordService = async (token, newPassword) => {
  const [rows] = await db.query(
    'SELECT user_id, expires_at FROM password_resets WHERE token = ?',
    [token]
  );

  if (rows.length === 0) throw { status: 400, message: message.INVALID_RESET_TOKEN };

  const { user_id, expires_at } = rows[0];
  if (new Date(expires_at) < new Date()) {
    throw { status: 400, message: message.RESET_TOKEN_EXPIRED };
  }

  // Ambil email dan role user
  const [userRows] = await db.query(
    'SELECT email, role FROM users WHERE id = ?',
    [user_id]
  );

  if (userRows.length === 0) {
    throw { status: 404, message: 'User tidak ditemukan' };
  }

  const { email, role } = userRows[0];

  // Jika role user biasa, cek apakah pernah reset 30 hari terakhir
  if (role === 'user') {
    const [resetLogs] = await db.query(`
      SELECT created_at FROM password_resets
      WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      ORDER BY created_at DESC
      LIMIT 1
    `, [user_id]);

    if (resetLogs.length > 0) {
      throw {
        status: 403,
        message: 'Reset password hanya diperbolehkan 1 kali dalam 30 hari untuk pengguna biasa.'
      };
    }
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await db.query(
    'UPDATE user_auth SET password = ? WHERE user_id = ?',
    [hashed, user_id]
  );

  await db.query('DELETE FROM password_resets WHERE token = ?', [token]);

  return {
    message: message.PASSWORD_RESET_SUCCESS,
    email,
  };
};
