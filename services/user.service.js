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

// Update profile guru
exports.updateTeacherProfile = async (userId, profileData) => {
    const {
        nip,
        phone,
        address,
        birth_place,
        birth_date,
        education,
        subject_specialization
    } = profileData;

    await db.query(`
        INSERT INTO teacher_profiles 
            (user_id, nip, phone, address, birth_place, birth_date, education, subject_specialization)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            nip = VALUES(nip),
            phone = VALUES(phone),
            address = VALUES(address),
            birth_place = VALUES(birth_place),
            birth_date = VALUES(birth_date),
            education = VALUES(education),
            subject_specialization = VALUES(subject_specialization)
    `, [userId, nip, phone, address, birth_place, birth_date, education, subject_specialization]);
};

// Ambil data lengkap user + profil guru
exports.getUserWithProfile = async (userId) => {
    const [rows] = await db.query(`
        SELECT 
            u.id AS user_id,
            u.name,
            u.email,
            u.age,
            t.nip,
            t.phone,
            t.address,
            t.birth_place,
            t.birth_date,
            t.education,
            t.subject_specialization
        FROM users u
        LEFT JOIN teacher_profiles t ON u.id = t.user_id
        WHERE u.id = ?
    `, [userId]);

    return rows[0] || null;
};

exports.updateAndGetTeacherProfile = async (userId, profileData) => {
    await this.updateTeacherProfile(userId, profileData);
    return await this.getUserWithProfile(userId);
};

exports.getUserById = async (userId) => {
    const [rows] = await db.query(
        `SELECT id, name, email, role FROM users WHERE id = ?`,
        [userId]
    );

    return rows[0] || null;
};



