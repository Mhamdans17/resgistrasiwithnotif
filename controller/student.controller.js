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
            data: {
                id: newStudent.id,
                parent_id: newStudent.parent_id,
                nik: newStudent.nik,
                full_name: newStudent.full_name,
                nickname: newStudent.nickname,
                birth_place: newStudent.birth_place,
                birth_date: newStudent.birth_date,
                gender: newStudent.gender,
                religion: newStudent.religion,
                address: newStudent.address,
                rt_rw: newStudent.rt_rw,
                village: newStudent.village,
                district: newStudent.district,
                nationality: newStudent.nationality,
                child_number: newStudent.child_number,
                siblings_count: newStudent.siblings_count,
                nisn: newStudent.nisn,
                nis: newStudent.nis
            }
        });
    } catch (err) {
        if (err.statusCode === 400) {
            return res.status(400).json({
                message: 'Validasi gagal',
                responseCode: responseCode.BAD_REQUEST,
                errors: [err.message]
            });
        }

        console.error('Create student error:', err);
        return res.status(500).json({
            message: messages.AUTH.SERVER_ERROR,
            responseCode: responseCode.SERVER_ERROR
        });
    }
};


exports.assignNis = async (req, res) => {
    try {
        const { full_name, nik, nisn, nis } = req.body;
        const student = await studentService.assignNis({ full_name, nik, nisn, nis });
        if (!student) {
            return res.status(404).json({
                message: messages.STUDENT.STUDENT_NOTFOUND,
                responseCode: responseCode.BAD_REQUEST
            });
        }

        res.status(200).json({
            message: 'NIS dan NISN berhasil ditambahkan',
            responseCode: responseCode.SUCCESS,
            data: student
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
            responseCode: responseCode.SERVER_ERROR
        });
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


exports.getStudents = async (req, res) => {
    try {
        const parentId = req.user.userId;
        if (!parentId) {
            return res.status(401).json({
                message: 'Parent ID tidak ditemukan',
                responseCode: responseCode.UNAUTHORIZED
            });
        }

        const students = await studentService.getStudentsByParentId(parentId);

        return res.status(200).json({
            message: 'Data siswa berhasil diambil',
            responseCode: responseCode.SUCCESS,
            data: students
        });
    } catch (err) {
        console.error('Get students error:', err);
        return res.status(500).json({
            message: 'Terjadi kesalahan pada server',
            responseCode: responseCode.SERVER_ERROR
        });
    }
};
