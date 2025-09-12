// student.service.js
const db = require('../config/db');
const resMessage = require('../constants/messages');

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
        throw new Error(resMessage.STUDENT.STUDENT_NOTFOUND);
    }

    return rows[0];
};

// services/student.service.js
exports.getIncompleteStudents = async (page = 1, limit = 5) => {
    const offset = (page - 1) * limit;

    // query data dengan paging
    const [rows] = await db.query(
        `
      SELECT id, full_name, nis, nisn
      FROM students
      WHERE nis IS NULL OR nis = '' 
         OR nisn IS NULL OR nisn = ''
      LIMIT ? OFFSET ?
    `,
        [limit, offset]
    );

    // query total untuk hitung jumlah semua incomplete
    const [countResult] = await db.query(
        `
      SELECT COUNT(*) AS total
      FROM students
      WHERE nis IS NULL OR nis = '' 
         OR nisn IS NULL OR nisn = ''
    `
    );

    return {
        totalData: countResult[0].total,
        page,
        limit,
        data: rows,
    };
};
