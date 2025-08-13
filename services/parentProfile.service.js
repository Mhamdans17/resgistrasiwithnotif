const db = require('../config/db');

exports.createOrUpdateParentProfile = async (userId, data) => {
    const sql = `
        INSERT INTO parent_profiles
        (user_id, relation, phone, address, occupation, income, birth_date, gender)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                                 relation = VALUES(relation),
                                 phone = VALUES(phone),
                                 address = VALUES(address),
                                 occupation = VALUES(occupation),
                                 income = VALUES(income),
                                 birth_date = VALUES(birth_date),
                                 gender = VALUES(gender)
    `;
    await db.query(sql, [
        userId,
        data.relation,
        data.phone,
        data.address,
        data.occupation,
        data.income,
        data.birth_date,
        data.gender
    ]);

    const [rows] = await db.query(`
        SELECT u.id AS user_id, u.name, u.email, u.age,
               p.relation, p.phone, p.address, p.occupation,
               p.income, p.birth_date, p.gender
        FROM users u
                 LEFT JOIN parent_profiles p ON u.id = p.user_id
        WHERE u.id = ?
    `, [userId]);

    return rows[0] || null;
};

exports.getParentProfileByUserId = async (userId) => {
    const [rows] = await db.query(`
        SELECT u.id AS user_id, u.name, u.email, u.age,
               p.relation, p.phone, p.address, p.occupation,
               p.income, p.birth_date, p.gender
        FROM users u
        LEFT JOIN parent_profiles p ON u.id = p.user_id
        WHERE u.id = ?
    `, [userId]);

    return rows[0] || null;
};

exports.getParentProfileById = async (id) => {
    const [rows] = await db.query(`
        SELECT u.id AS user_id, u.name, u.email, u.age,
               p.relation, p.phone, p.address, p.occupation,
               p.income, p.birth_date, p.gender
        FROM users u
        LEFT JOIN parent_profiles p ON u.id = p.user_id
        WHERE u.id = ?
    `, [id]);
    return rows[0] || null;
};