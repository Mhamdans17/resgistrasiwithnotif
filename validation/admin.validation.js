const Joi = require('joi');

exports.addAdminSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email harus berupa teks',
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi',
    'string.empty': 'Email tidak boleh kosong',
  }),
});