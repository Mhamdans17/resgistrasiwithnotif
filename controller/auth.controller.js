const {
  completeRegistrationService,
  loginService,
  forgotPasswordService,
  resetPasswordService
} = require('../services/auth.service');

const {
  completeRegistrationSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require('../validation/auth.validation');

const jwt = require('jsonwebtoken');
const redisClient = require('../utils/redis');
const { sendResetSuccessEmail } = require('../services/email.service');

// COMPLETE REGISTRATION
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

// LOGOUT
exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ message: 'Token tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1];

    // Hitung waktu kadaluarsa token
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    // Simpan token ke Redis untuk blacklist
    await redisClient.setEx(`blacklist:${token}`, expiresIn, '1');

    return res.status(200).json({ message: 'Logout berhasil' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal logout' });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { error, value } = forgotPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email } = value;

  try {
    const result = await forgotPasswordService(email);
    res.status(200).json(result);
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Terjadi kesalahan server' });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { error, value } = resetPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { token, newPassword } = value;

  try {
    const result = await resetPasswordService(token, newPassword);
    await sendResetSuccessEmail(result.email);
    res.status(200).json(result);
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Terjadi kesalahan saat reset password' });
  }
};
