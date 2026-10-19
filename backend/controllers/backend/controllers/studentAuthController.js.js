const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");


// =====================================================
// STUDENT LOGIN
// =====================================================

const studentLogin = async (req, res) => {

    try {

        const {
            admissionNumber,
            password
        } = req.body;

        if (!admissionNumber) {

            return res.status(400).json({
                message: "Admission number is required"
            });

        }

        if (!password) {

            return res.status(400).json({
                message: "Password is required"
            });

        }


        // FIND STUDENT

        const student = await Student.findOne({
            admissionNumber:
                admissionNumber.trim()
        });

        if (!student) {

            return res.status(401).json({
                message:
                    "Invalid admission number or password"
            });

        }


        // CHECK ACTIVE

        if (!student.isActive) {

            return res.status(403).json({
                message:
                    "Your student account is inactive"
            });

        }


        // CHECK PASSWORD

        const passwordMatch =
            await bcrypt.compare(
                password,
                student.password
            );

        if (!passwordMatch) {

            return res.status(401).json({
                message:
                    "Invalid admission number or password"
            });

        }


        // CREATE TOKEN

        const token =
            jwt.sign(

                {
                    studentId:
                        student._id.toString()
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }

            );


        // RESPONSE

        res.status(200).json({

            message:
                "Student login successful",

            token,

            student: {

                id:
                    student._id,

                firstName:
                    student.firstName,

                lastName:
                    student.lastName,

                gender:
                    student.gender,

                dateOfBirth:
                    student.dateOfBirth,

                className:
                    student.className,

                admissionNumber:
                    student.admissionNumber,

                parentName:
                    student.parentName,

                parentPhone:
                    student.parentPhone,

                address:
                    student.address

            }

        });

    } catch (error) {

        console.error(
            "STUDENT LOGIN ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Student login failed"

        });

    }

};


// =====================================================
// GET LOGGED-IN STUDENT
// =====================================================

const getStudentProfile =
    async (req, res) => {

        try {

            const student =
                await Student.findById(
                    req.student._id
                ).select("-password");

            if (!student) {

                return res.status(404).json({
                    message:
                        "Student not found"
                });

            }

            res.status(200).json({

                student

            });

        } catch (error) {

            console.error(
                "GET STUDENT PROFILE ERROR:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to load student profile"

            });

        }

    };


module.exports = {

    studentLogin,

    getStudentProfile

};