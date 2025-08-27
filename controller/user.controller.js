const userService = require('../services/user.service');
const messages = require('../constants/messages');
const { userSchema } = require('../validation/user.validation');
const { sendWelcomeEmail } = require('../services/email.service');
const responseCode = require('../constants/responsecode');
const { teacherProfileSchema } = require('../validation/profile.validation');


exports.createUser = async (req, res) => {
    const {name, email, age} = req.body;

    const { error } = userSchema.validate({ name, email, age });
    if (error) {
        return res.status(400).json({
        message: error.details[0].message,
        responseCode: responseCode.BAD_REQUEST,
        });
    }

    try {
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser){
            return res.status(400).json({
                message: messages.USER.USER_EMAIL_EXISTS,
                responseCode: responseCode.BAD_REQUEST,
            });
        }

        const userId = await userService.createUser({ name, email, age });

        await sendWelcomeEmail(email, name);

        return res.status(200).json({
        message: messages.USER.USER_CREATED_SUCCESS,
        repsonseCode: responseCode.SUCCESS,
        accepData: [
            {
            nama: name,
            email: email
            }
        ]
        });
    } catch (error) { 
        console.error('User insert error:', error);
        res.status(500).json({ message: messages.GENERAL.SERVER_ERROR })
        
    }
};

exports.completeTeacherProfile = async (req, res) => {
    try {
        const { error } = teacherProfileSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: 'Validasi gagal',
                responseCode: responseCode.BAD_REQUEST,
                errors: error.details.map(e => e.message)
            });
        }

        const userId = req.user.userId;
        const profileData = req.body;

        const updatedUser = await userService.updateAndGetTeacherProfile(userId, profileData);

        return res.status(200).json({
            message: 'Profil guru berhasil diperbarui',
            responseCode: responseCode.SUCCESS,
            data: updatedUser
        });

    } catch (err) {
        console.error('Update profile error:', err);
        return res.status(500).json({ message: messages.GENERAL.SERVER_ERROR });
    }
};



