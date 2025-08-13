const Joi = require('joi');

exports.parentProfileSchema = Joi.object({
    relation: Joi.string().required().messages({
        'string.empty': 'Hubungan dengan siswa wajib diisi',
        'any.required': 'Hubungan dengan siswa wajib diisi'
    }),
    phone: Joi.string().required().messages({
        'string.empty': 'Nomor telepon wajib diisi',
        'any.required': 'Nomor telepon wajib diisi'
    }),
    address: Joi.string().allow(''),
    occupation: Joi.string().allow(''),
    income: Joi.number().allow(null),
    birth_date: Joi.date().allow(null),
    gender: Joi.string().valid('Laki-laki', 'Perempuan').allow(null)
});
