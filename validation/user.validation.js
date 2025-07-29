const Joi = require('joi');

exports.userSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Nama tidak boleh kosong',
    'any.required': 'Nama wajib diisi',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Format email tidak valid',
    'string.empty': 'Email tidak boleh kosong',
    'any.required': 'Email wajib diisi',
  }),
  age: Joi.number().integer().min(0).required().messages({
    'number.base': 'Umur harus berupa angka',
    'number.min': 'Umur tidak boleh negatif',
    'any.required': 'Umur wajib diisi',
  }),
});
