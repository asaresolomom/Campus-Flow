const Teacher = require("../models/Teacher");

// Add Teacher
const addTeacher = async (req, res) => {
    try {

        const {
            firstName,
            lastName,
            gender,
            email,
            phone,
            subject,
            qualification,
            address
        } = req.body;


        const existingTeacher = await Teacher.findOne({
            email,
            school: req.school.id
        });


        if (existingTeacher) {
            return res.status(400).json({
                message: "Teacher already exists"
            });
        }


        const teacher = await Teacher.create({
            firstName,
            lastName,
            gender,
            email,
            phone,
            subject,
            qualification,
            address,
            school: req.school.id
        });


        res.status(201).json({
            message: "Teacher added successfully",
            teacher
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Get All Teachers
const getTeachers = async (req, res) => {
    try {

        const teachers = await Teacher.find({
            school: req.school.id
        });


        res.status(200).json({
            count: teachers.length,
            teachers
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Get Single Teacher
const getTeacherById = async (req, res) => {
    try {

        const teacher = await Teacher.findOne({
            _id: req.params.id,
            school: req.school.id
        });


        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }


        res.status(200).json(teacher);


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Update Teacher
const updateTeacher = async (req, res) => {
    try {

        const teacher = await Teacher.findOneAndUpdate(
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


        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }


        res.status(200).json({
            message: "Teacher updated successfully",
            teacher
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Delete Teacher
const deleteTeacher = async (req, res) => {
    try {

        const teacher = await Teacher.findOneAndDelete({
            _id: req.params.id,
            school: req.school.id
        });


        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }


        res.status(200).json({
            message: "Teacher deleted successfully"
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    addTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher
};
