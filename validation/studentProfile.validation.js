const Joi = require('joi');

exports.studentSchema = Joi.object({
    full_name: Joi.string().required().messages({
        'string.empty': 'Nama lengkap wajib diisi',
        'any.required': 'Nama lengkap wajib diisi'
    }),
    nickname: Joi.string().required().messages({
        'string.empty': 'Nama panggilan wajib diisi',
        'any.required': 'Nama panggilan wajib diisi'
    }),
    birth_place: Joi.string().required().messages({
        'string.empty': 'Tempat lahir wajib diisi',
        'any.required': 'Tempat lahir wajib diisi'
    }),
    birth_date: Joi.date().required().messages({
        'date.base': 'Tanggal lahir harus berupa format tanggal yang valid',
        'any.required': 'Tanggal lahir wajib diisi'
    }),
    gender: Joi.string().valid('Laki-laki', 'Perempuan').required().messages({
        'any.only': 'Jenis kelamin harus Laki-laki atau Perempuan',
        'any.required': 'Jenis kelamin wajib diisi'
    }),
    religion: Joi.string().required().messages({
        'string.empty': 'Agama wajib diisi',
        'any.required': 'Agama wajib diisi'
    }),
    address: Joi.string().required().messages({
        'string.empty': 'Alamat wajib diisi',
        'any.required': 'Alamat wajib diisi'
    }),
    rt_rw: Joi.string().required().messages({
        'string.empty': 'RT/RW wajib diisi',
        'any.required': 'RT/RW wajib diisi'
    }),
    village: Joi.string().required().messages({
        'string.empty': 'Kelurahan/Desa wajib diisi',
        'any.required': 'Kelurahan/Desa wajib diisi'
    }),
    district: Joi.string().required().messages({
        'string.empty': 'Kecamatan wajib diisi',
        'any.required': 'Kecamatan wajib diisi'
    }),
    nationality: Joi.string().required().messages({
        'string.empty': 'Kewarganegaraan wajib diisi',
        'any.required': 'Kewarganegaraan wajib diisi'
    }),
    child_number: Joi.number().integer().min(1).required().messages({
        'number.base': 'Nomor urut anak harus berupa angka',
        'number.min': 'Nomor urut anak minimal 1',
        'any.required': 'Nomor urut anak wajib diisi'
    }),
    siblings_count: Joi.number().integer().min(0).required().messages({
        'number.base': 'Jumlah saudara harus berupa angka',
        'number.min': 'Jumlah saudara minimal 0',
        'any.required': 'Jumlah saudara wajib diisi'
    })
});

