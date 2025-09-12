const studentService = require('../services/student.service');
const messages = require('../constants/messages');
const responseCode = require('../constants/responsecode');
const { studentSchema } = require('../validation/studentProfile.validation');
const {BAD_REQUEST} = require("../constants/responsecode");
const studenService = require('../services/student.service');

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

exports.getIncompleteStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const result = await studentService.getIncompleteStudents(page, limit);

        res.json({
            message: "Daftar siswa dengan data NIS/NISN belum lengkap",
            responseCode: responseCode.SUCCESS,
            ...result,
        });
    } catch (err) {
        console.error("Error getIncompleteStudents:", err);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};
