const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Service activate email
exports.completeRegistrationService = async (email, password) => {
  const [userRows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (userRows.length === 0) throw { status: 400, message: 'Email tidak ditemukan' };

  const userId = userRows[0].id;

  const [authRows] = await db.query('SELECT id FROM user_auth WHERE user_id = ?', [userId]);
  if (authRows.length > 0) throw { status: 400, message: 'Akun sudah terdaftar' };

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    'INSERT INTO user_auth (user_id, password, is_active) VALUES (?, ?, ?)',
    [userId, hashedPassword, true]
  );

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return { message: 'Registrasi berhasil', token };
};

//Service Login
exports.loginService = async (email, password) => {
  const [userRows] = await db.query('SELECT id, name FROM users WHERE email = ?', [email]);
  if (userRows.length === 0) {
    throw { status: 400, message: 'Email tidak ditemukan' };
  }

  const user = userRows[0];

  const [authRows] = await db.query('SELECT password FROM user_auth WHERE user_id = ?', [user.id]);
  if (authRows.length === 0) {
    throw { status: 400, message: 'Akun belum aktif' };
  }

  const isMatch = await bcrypt.compare(password, authRows[0].password);
  if (!isMatch) {
    throw { status: 400, message: 'Password salah' };
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return {
    message: 'Login berhasil',
    token,
    user: {
      id: user.id,
      name: user.name,
      email
    }
  };
};