const { addAdminEmail, getAllAdmins } = require('../services/admin.service');
const { addAdminSchema } = require('../validation/admin.validation');
const message = require('../constants/messages')
const responseCode = require('../constants/responseCode');

exports.addAdmin = async (req, res) => {
  const { error, value } = addAdminSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, role } = value;
    const result = await addAdminEmail(email, role);
    res.status(200).json({
        message: message.ADMIN.SUCCESS_ADD_ADMIN,
        responseCode: responseCode.SUCCESS,
        data: result });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || message.ADMIN.FAILED_ADD_ADMIN });
  }
};

exports.listAdmins = async (_req, res) => {
  try {
    const admins = await getAllAdmins();
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: message.ADMIN.FAILED_GET_DATA_ADMIN });
  }
};
