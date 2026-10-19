const Student = require("../models/student");


// =====================================================
// GENERATE ADMISSION NUMBER
// =====================================================

const generateAdmissionNumber = async (schoolId) => {

    const year = new Date().getFullYear();

    let number = 1;

    while (true) {

        const admissionNumber =
            `ADM-${year}-${String(number).padStart(4, "0")}`;

        const existingStudent =
            await Student.findOne({
                admissionNumber,
                school: schoolId
            });

        if (!existingStudent) {
            return admissionNumber;
        }

        number++;
    }
};


// =====================================================
// ADD STUDENT
// =====================================================

const addStudent = async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            gender,
            dateOfBirth,
            className,
            parentName,
            parentPhone,
            address
        } = req.body;


        if (!firstName ||
            !lastName ||
            !gender ||
            !dateOfBirth ||
            !className ||
            !parentName ||
            !parentPhone ||
            !address) {

            return res.status(400).json({
                message: "Please fill in all student information"
            });

        }


        const student =
            await Student.create({

                firstName,
                lastName,
                gender,
                dateOfBirth,
                className,

                // No admission number yet
                admissionNumber: null,

                // Student becomes active after 30%
                isActive: false,

                parentName,
                parentPhone,
                address,

                school: req.school.id
            });


        return res.status(201).json({

            message:
                "Student registered successfully. Admission number will be generated after 30% school fee payment.",

            student

        });

    }

    catch (error) {

        console.error(
            "ADD STUDENT ERROR:",
            error
        );

        return res.status(500).json({
            message: error.message
        });

    }

};


// =====================================================
// GET ALL STUDENTS
// =====================================================

const getStudents = async (req, res) => {

    try {

        const students =
            await Student.find({
                school: req.school.id
            }).sort({
                createdAt: -1
            });


        return res.status(200).json({

            count: students.length,

            students

        });

    }

    catch (error) {

        console.error(
            "GET STUDENTS ERROR:",
            error
        );

        return res.status(500).json({
            message: error.message
        });

    }

};


// =====================================================
// GET ONE STUDENT
// =====================================================

const getStudentById = async (req, res) => {

    try {

        const student =
            await Student.findOne({

                _id: req.params.id,

                school: req.school.id

            });


        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        return res.status(200).json(student);

    }

    catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};


// =====================================================
// UPDATE STUDENT
// =====================================================

const updateStudent = async (req, res) => {

    try {

        // Prevent manually changing these fields
        // through the normal student edit page.

        const allowedFields = {

            firstName: req.body.firstName,

            lastName: req.body.lastName,

            gender: req.body.gender,

            dateOfBirth: req.body.dateOfBirth,

            className: req.body.className,

            parentName: req.body.parentName,

            parentPhone: req.body.parentPhone,

            address: req.body.address

        };


        const student =
            await Student.findOneAndUpdate(

                {
                    _id: req.params.id,

                    school: req.school.id

                },

                allowedFields,

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        return res.status(200).json({

            message:
                "Student updated successfully",

            student

        });

    }

    catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};


// =====================================================
// DELETE STUDENT
// =====================================================

const deleteStudent = async (req, res) => {

    try {

        const student =
            await Student.findOneAndDelete({

                _id: req.params.id,

                school: req.school.id

            });


        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        return res.status(200).json({

            message:
                "Student deleted successfully"

        });

    }

    catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    addStudent,

    getStudents,

    getStudentById,

    updateStudent,

    deleteStudent,

    generateAdmissionNumber

};
