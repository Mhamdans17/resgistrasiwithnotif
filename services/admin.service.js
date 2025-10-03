const db = require('../config/db');

exports.addAdminEmail = async (email, role) => {
  const checkSql = 'SELECT 1 FROM admin_list WHERE email = ?';
  const [existing] = await db.query(checkSql, [email]);

  if (existing.length > 0) {
    throw { status: 400, message: 'Email sudah terdaftar sebagai admin' };
  }

  const insertSql = 'INSERT INTO admin_list (email, role) VALUES (?,?)';
  const [result] = await db.query(insertSql, [email, role]);
  return { id: result.insertId, email, role };
};

exports.getAllAdmins = async () => {
  const sql = 'SELECT * FROM admin_list';
  const [rows] = await db.query(sql);
  return rows;
};
