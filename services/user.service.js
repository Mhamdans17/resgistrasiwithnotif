const db = require('../config/db');

async function isAdminEmail(email) {
  const sql = 'SELECT 1 FROM admin_list WHERE email = ? LIMIT 1';
  const [rows] = await db.query(sql, [email]);
  return rows.length > 0;
}

exports.findUserByEmail = async (email) => {
  const sql = 'SELECT id FROM users WHERE email = ?';
  const [rows] = await db.query(sql, [email]);
  return rows[0];
};

exports.createUser = async ({ name, email, age }) => {
  const isAdmin = await isAdminEmail(email);
  const role = isAdmin ? 'admin' : 'user';

  const sql = 'INSERT INTO users (name, email, age, role) VALUES (?, ?, ?, ?)';
  const [result] = await db.query(sql, [name, email, age, role]);
  return result.insertId;
};
