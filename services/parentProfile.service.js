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
        SELECT
            u.id AS user_id,
            u.name,
            u.email,
            u.age,
            p.relation,
            p.phone,
            p.address,
            p.occupation,
            p.income,
            p.birth_date,
            p.gender,
            s.id AS student_id,
            s.full_name AS student_name,
            s.nickname,
            s.birth_place,
            s.birth_date AS student_birth_date,
            s.gender AS student_gender,
            s.religion,
            s.address AS student_address,
            s.nisn,
            s.nis
        FROM users u
                 LEFT JOIN parent_profiles p ON u.id = p.user_id
                 LEFT JOIN students s ON p.user_id = s.parent_id
        WHERE u.id = ?
    `, [id]);

    if (rows.length === 0) return null;

    // Format data parent + children list
    const parent = {
        user_id: rows[0].user_id,
        name: rows[0].name,
        email: rows[0].email,
        age: rows[0].age,
        relation: rows[0].relation,
        phone: rows[0].phone,
        address: rows[0].address,
        occupation: rows[0].occupation,
        income: rows[0].income,
        birth_date: rows[0].birth_date,
        gender: rows[0].gender,
        children_count: rows.filter(r => r.student_id !== null).length,
        students: rows
            .filter(r => r.student_id !== null)
            .map(r => ({
                id: r.student_id,
                full_name: r.student_name,
                nickname: r.nickname,
                birth_place: r.birth_place,
                birth_date: r.student_birth_date,
                gender: r.student_gender,
                religion: r.religion,
                address: r.student_address,
                nisn: r.nisn,
                nis: r.nis
            }))
    };

    return parent;
};
