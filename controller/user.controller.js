const userService = require('../services/user.service');

exports.createUser = async (req, res) => {
    const {name, email, age} = req.body;

    if(!name || !email || !age) {
        return res.status(400).json({ message: 'Lengkapi semua data' });
    }

    try {
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser){
            return res.status(400).json({ message: messages.USER_EMAIL_EXISTS });
        }

        const userId = await userService.createUser({ name, email, age });
        return res.status(200).json({
        message: messages.USER_CREATED_SUCCESS,
        repsonseCode: '200',
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