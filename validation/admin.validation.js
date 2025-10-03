const Joi = require('joi');

exports.addAdminSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email harus berupa teks',
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi',
    'string.empty': 'Email tidak boleh kosong',
  }),

    role: Joi.string().valid('guru', 'superadmin').required().messages({
        'any.only': 'Role hanya boleh berisi guru atau superadmin',
        'string.base': 'Role harus berupa teks',
        'any.required': 'Role wajib diisi',
        'string.empty': 'Role tidak boleh kosong',
    }),
});