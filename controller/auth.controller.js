const { completeRegistrationService, loginService } = require('../services/auth.service');
const { completeRegistrationSchema, loginSchema } = require('../validation/auth.validation');

// ACTIVATE EMAIL
exports.completeRegistration = async (req, res) => {
  const { error, value } = completeRegistrationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = value;

  try {
    const result = await completeRegistrationService(email, password);
    res.status(200).json(result);
  } catch (err) {
    console.error('Register error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Terjadi kesalahan server' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = value;

  try {
    const result = await loginService(email, password);
    res.status(200).json(result);
  } catch (err) {
    console.error('Login error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Terjadi kesalahan server' });
  }
};

//LOGOUT

