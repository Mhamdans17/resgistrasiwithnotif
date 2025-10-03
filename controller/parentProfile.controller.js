const parentProfileService = require('../services/parentProfile.service');
const { parentProfileSchema } = require('../validation/profile.parent.validation');
const messages = require('../constants/messages');
const responseCode = require('../constants/responsecode');

exports.completeParentProfile = async (req, res) => {
    try {
        const { error } = parentProfileSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                message: 'VALIDASI GAGAL',
                responseCode: responseCode.BAD_REQUEST,
                errors: error.details.map(e => e.message)
            });
        }

        const userId = req.user.userId;
        const profileData = req.body;

        const dataprofile = await parentProfileService.createOrUpdateParentProfile(userId, profileData);

        return res.status(200).json({
            message: 'PROFIL WALI MURID BERHASIL DIPERBARUI',
            responseCode: responseCode.SUCCESS,
            data: dataprofile
        });

    } catch (err) {
        console.error('UPDATE WALI MURID ERROR:', err);
        return res.status(500).json({
            message: messages.GENERAL.SERVER_ERROR,
            responseCode: responseCode.SERVER_ERROR
        });
    }
};


exports.getParentProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const profile = await parentProfileService.getParentProfileByUserId(userId);

        if (!profile) {
            return res.status(404).json({
                message: 'DATA WALI MURID TIDAK DITEMUKAN',
                responseCode: responseCode.BAD_REQUEST
            });
        }

        return res.status(200).json({
            message: 'DATA WALI MURID DITEMUKAN',
            responseCode: responseCode.SUCCESS,
            data: profile
        });
    } catch (err) {
        console.error('Get wali murid error:', err);
        return res.status(500).json({ message: messages.GENERAL.SERVER_ERROR });
    }
};


exports.getParentProfileById = async (req, res) => {
    try {
        const id = req.params.id;
        const profile = await parentProfileService.getParentProfileById(id);

        if (!profile) {
            return res.status(404).json({
                message: 'Data wali murid tidak ditemukan',
                responseCode: responseCode.BAD_REQUEST
            });
        }

        return res.status(200).json({
            message: 'Data wali murid ditemukan',
            responseCode: responseCode.SUCCESS,
            data: profile
        });
    } catch (err) {
        console.error('Get wali murid by ID error:', err);
        return res.status(500).json({ message: messages.GENERAL.SERVER_ERROR });
    }
};


