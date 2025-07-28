const db = require('../config/db');

exports.findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id FROM users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

exports.createUser = ({ name, email, age }) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
    db.query(sql, [name, email, age], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};
