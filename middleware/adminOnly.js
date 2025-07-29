const db = require('../config/db');

const adminOnly = async (req, res, next) => {
  const user = req.user;

  if (!user || !user.userId) {
    return res.status(401).json({ message: 'Unauthorized: Silakan login dulu' });
  }

  try {
    const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [user.userId]);

    if (rows.length === 0 || rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Akses hanya untuk admin' });
    }

    next();
  } catch (err) {
    console.error('Error cek role admin:', err);
    res.status(500).json({ message: 'Server error saat cek role' });
  }
};

module.exports = adminOnly;
