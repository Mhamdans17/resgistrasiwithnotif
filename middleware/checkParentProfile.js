// middleware/checkParentProfile.js
const db = require('../config/db');
const responseCode = require("../constants/responsecode");

const checkParentProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        console.log(`Mengecek parent profile untuk user_id: ${userId}`);

        const [rows] = await db.query(
            'SELECT * FROM parent_profiles WHERE user_id = ?',
            [userId]
        );

        if (!rows.length) {
            return res.status(400).json({
                message: 'Data profil orang tua belum diisi sama sekali.',
                responseCode: responseCode.BAD_REQUEST
            });
        }

        const profile = rows[0];
        const requiredFields = ['relation', 'phone', 'address', 'occupation', 'income', 'birth_date', 'gender'];

        const missingFields = requiredFields.filter(field => !profile[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Profil orang tua belum lengkap. Kolom yang kosong: ${missingFields.join(', ')}`,
                responseCode: responseCode.BAD_REQUEST
            });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
        responseCode.BAD_REQUEST;
    }
};

module.exports = checkParentProfile;
