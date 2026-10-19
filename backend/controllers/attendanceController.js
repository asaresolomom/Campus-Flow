const Attendance = require("../models/Attendance");

// Mark Attendance
const markAttendance = async (req, res) => {

    try {

        const {
            student,
            class: classId,
            subject,
            teacher,
            attendanceDate,
            status
        } = req.body;

        // Prevent duplicate attendance for the same student on the same subject and date
        const existingAttendance = await Attendance.findOne({
            student,
            subject,
            attendanceDate,
            school: req.school.id
        });

        if (existingAttendance) {
            return res.status(400).json({
                message: "Attendance already marked for this student."
            });
        }

        const attendance = await Attendance.create({
            student,
            class: classId,
            subject,
            teacher,
            attendanceDate,
            status,
            school: req.school.id
        });

        res.status(201).json({
            message: "Attendance marked successfully",
            attendance
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Get All Attendance
const getAttendance = async (req, res) => {

    try {

        const attendance = await Attendance.find({
            school: req.school.id
        })
            .populate("student", "firstName lastName admissionNumber")
            .populate("teacher", "firstName lastName")
            .populate("subject", "subjectName")
            .populate("class", "className section");

        res.status(200).json({
            count: attendance.length,
            attendance
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Get Attendance By ID
const getAttendanceById = async (req, res) => {

    try {

        const attendance = await Attendance.findOne({
            _id: req.params.id,
            school: req.school.id
        })
            .populate("student", "firstName lastName")
            .populate("teacher", "firstName lastName")
            .populate("subject", "subjectName")
            .populate("class", "className section");

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.status(200).json(attendance);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Update Attendance
const updateAttendance = async (req, res) => {

    try {

        const attendance = await Attendance.findOneAndUpdate(
            {
                _id: req.params.id,
                school: req.school.id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.status(200).json({
            message: "Attendance updated successfully",
            attendance
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Delete Attendance
const deleteAttendance = async (req, res) => {

    try {

        const attendance = await Attendance.findOneAndDelete({
            _id: req.params.id,
            school: req.school.id
        });

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.status(200).json({
            message: "Attendance deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    markAttendance,
    getAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance
};
