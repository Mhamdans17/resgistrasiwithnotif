const studentService = require('../services/student.service');
const messages = require('../constants/messages');
const responseCode = require('../constants/responsecode');
const { studentSchema } = require('../validation/studentProfile.validation');
const {BAD_REQUEST} = require("../constants/responsecode");

exports.createStudent = async (req, res) => {
    try {
        const parentId = req.user.userId;
        if (!parentId) {
            return res.status(401).json({ message: 'Parent ID tidak ditemukan, pastikan sudah login.' });
        }

        const { error, value } = studentSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: 'Validasi gagal',
                responseCode: responseCode.BAD_REQUEST,
                errors: error.details.map(err => err.message)
            });
        }

        const newStudent = await studentService.createStudent(parentId, value);

        return res.status(200).json({
            message: 'Siswa berhasil didaftarkan',
            responseCode: responseCode.SUCCESS,
            data: newStudent
        });
    } catch (err) {
        console.error('Create student error:', err);
        return res.status(500).json({
            message: messages.SERVER_ERROR,
            responseCode: responseCode.SERVER_ERROR
        });
    }
};


exports.assignNis = async (req, res) => {
    try {
        const { id } = req.params;
        const { nisn, nis } = req.body;
        const student = await studentService.assignNis(id, { nisn, nis });

        res.status(200).json({
            message: 'NIS dan NISN berhasil ditambahkan',
            responseCode: responseCode.SUCCESS,
            data: student
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
