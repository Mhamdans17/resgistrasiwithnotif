const Joi = require('joi');

exports.teacherProfileSchema = Joi.object({
    nip: Joi.string().required().messages({
        'string.empty': 'NIP tidak boleh kosong',
        'any.required': 'NIP wajib diisi',
    }),
    phone: Joi.string().pattern(/^[0-9]+$/).required().messages({
        'string.pattern.base': 'Nomor telepon hanya boleh angka',
        'string.empty': 'Nomor telepon tidak boleh kosong',
        'any.required': 'Nomor telepon wajib diisi',
    }),
    address: Joi.string().required().messages({
        'string.empty': 'Alamat tidak boleh kosong',
        'any.required': 'Alamat wajib diisi',
    }),
    birth_place: Joi.string().required().messages({
        'string.empty': 'Tempat lahir tidak boleh kosong',
        'any.required': 'Tempat lahir wajib diisi',
    }),
    birth_date: Joi.date().required().messages({
        'date.base': 'Tanggal lahir tidak valid',
        'any.required': 'Tanggal lahir wajib diisi',
    }),
    education: Joi.string().required().messages({
        'string.empty': 'Pendidikan tidak boleh kosong',
        'any.required': 'Pendidikan wajib diisi',
    }),
    subject_specialization: Joi.string().required().messages({
        'string.empty': 'Spesialisasi mata pelajaran tidak boleh kosong',
        'any.required': 'Spesialisasi mata pelajaran wajib diisi',
    }),
});
