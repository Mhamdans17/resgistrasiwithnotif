const Joi = require('joi');

exports.completeRegistrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email tidak boleh kosong',
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password tidak boleh kosong',
    'string.min': 'Password minimal 6 karakter',
    'any.required': 'Password wajib diisi'
  })
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email tidak boleh kosong',
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password tidak boleh kosong',
    'string.min': 'Password minimal 6 karakter',
    'any.required': 'Password wajib diisi'
  })
});

// Schema untuk lupa password
exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email tidak boleh kosong',
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi'
  })
});

// Schema untuk reset password
exports.resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token tidak boleh kosong',
    'any.required': 'Token wajib diisi'
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.empty': 'Password baru tidak boleh kosong',
    'string.min': 'Password baru minimal 6 karakter',
    'any.required': 'Password baru wajib diisi'
  })
});
