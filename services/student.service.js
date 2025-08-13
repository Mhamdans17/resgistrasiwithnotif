// student.service.js
const db = require('../config/db');

exports.createStudent = async (parentId, data) => {
    const sql = `
        INSERT INTO students
        (parent_id, full_name, nickname, birth_place, birth_date, gender, religion,
         address, rt_rw, village, district, nationality, child_number, siblings_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        parentId,
        data.full_name,
        data.nickname,
        data.birth_place,
        data.birth_date,
        data.gender,
        data.religion,
        data.address,
        data.rt_rw,
        data.village,
        data.district,
        data.nationality,
        data.child_number,
        data.siblings_count
    ];

    const [result] = await db.execute(sql, values);
    const [rows] = await db.query(`SELECT * FROM students WHERE id = ?`, [result.insertId]);
    return rows[0] || null;
};

exports.assignNis = async (id, { nisn, nis }) => {
    await db.query(
        'UPDATE students SET nisn = ?, nis = ? WHERE id = ?',
        [nisn, nis, id]
    );
    const [rows] = await db.query(
        'SELECT id, full_name, nis, nisn, gender, birth_date, address FROM students WHERE id = ?',
        [id]
    );

    if (rows.length === 0) {
        throw new Error('Siswa tidak ditemukan');
    }

    return rows[0];
};
