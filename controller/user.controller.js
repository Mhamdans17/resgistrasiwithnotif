const userService = require('../services/user.service');
const messages = require('../constants/messages');
const { userSchema } = require('../validation/user.validation');
const { sendWelcomeEmail } = require('../services/email.service');
const responseCode = require('../constants/responsecode');


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
            return res.status(400).json({ message: messages.USER_EMAIL_EXISTS });
        }

        const userId = await userService.createUser({ name, email, age });

        await sendWelcomeEmail(email, name);

        return res.status(200).json({
        message: messages.USER_CREATED_SUCCESS,
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
        res.status(500).json({ message: messages.SERVER_ERROR })
        
    }
};