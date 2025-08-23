// middleware/checkParentProfile.js
const db = require('../config/db');
const responseCode = require("../constants/responsecode");
const responseMes = require("../constants/messages")

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
                message: responseMes.DATA_PARENT_NOTFOUND,
                responseCode: responseCode.BAD_REQUEST
            });
        }

        const profile = rows[0];
        const requiredFields = ['relation', 'phone', 'address', 'occupation', 'income', 'birth_date', 'gender'];

        const missingFields = requiredFields.filter(field => !profile[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message:  `${responseMes.PARENT_PROFILE_UNCOMPLITE} ${missingFields.join(', ')}`,
                responseCode: responseCode.BAD_REQUEST
            });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: responseMes.SERVER_ERROR });
        responseCode.BAD_REQUEST;
    }
};

module.exports = checkParentProfile;
