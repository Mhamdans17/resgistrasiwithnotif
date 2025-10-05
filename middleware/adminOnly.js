const db = require('../config/db');
const message = require('../constants/messages')
const ROLEUSER = process.env.USERADMIN;
const ROLEGURU = process.env.USERGURU;

const adminOnly = async (req, res, next) => {
    const user = req.user;

    if (!user || !user.userId) {
        return res.status(401).json({ message: message.AUTH.SEVER_ERROR_ROLE });
    }

    try {
        const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [user.userId]);

        if (rows.length === 0) {
            return res.status(403).json({ message: message.ADMIN.FORBIDEN_ACCESS });
        }

        const role = rows[0].role?.toLowerCase();

        if (role === ROLEUSER || role === ROLEGURU) {
            return next();
        }

        return res.status(403).json({ message: message.ADMIN.FORBIDEN_ACCESS });
    } catch (err) {
        console.error(message.ADMIN.ERROR_CHECK_ROLE_ADMIN, err);
        res.status(500).json({ message: message.AUTH.SEVER_ERROR_ROLE });
    }
};

module.exports = adminOnly;
