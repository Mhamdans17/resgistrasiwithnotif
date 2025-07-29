const { addAdminEmail, getAllAdmins } = require('../services/admin.service');
const { addAdminSchema } = require('../validation/admin.validation');
const message = require('../constants/messages')

exports.addAdmin = async (req, res) => {
  const { error, value } = addAdminSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email } = value; 
    const result = await addAdminEmail(email);
    res.status(200).json({ message: message.SUCCESS_ADD_ADMIN, data: result });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || message.FAILED_ADD_ADMIN });
  }
};

exports.listAdmins = async (_req, res) => {
  try {
    const admins = await getAllAdmins();
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: message.FAILED_GET_DATA_ADMIN });
  }
};
