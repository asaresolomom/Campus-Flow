const jwt = require("jsonwebtoken");

const Student = require("../models/student");
const Fee = require("../models/Fee");
const Payment = require("../models/Payment");
const Result = require("../models/Result");
const Exam = require("../models/Exam");


// =====================================================
// GENERATE TOKEN
// =====================================================

const generateStudentToken = (student) => {

    return jwt.sign(
        {
            studentId: student._id,
            schoolId: student.school,
            role: "student"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};


// =====================================================
// STUDENT LOGIN
// =====================================================

const studentLogin = async (req, res) => {

    try {

        const {
            admissionNumber,
            parentPhone
        } = req.body;

        if (!admissionNumber) {
            return res.status(400).json({
                message: "Admission number is required"
            });
        }

        if (!parentPhone) {
            return res.status(400).json({
                message: "Parent phone number is required"
            });
        }


        const student =
            await Student.findOne({
                admissionNumber:
                    admissionNumber.trim()
            });


        if (!student) {
            return res.status(404).json({
                message:
                    "Student with this admission number was not found"
            });
        }


        if (
            student.parentPhone.trim() !==
            parentPhone.trim()
        ) {
            return res.status(401).json({
                message:
                    "Incorrect parent phone number"
            });
        }


        const token =
            generateStudentToken(student);


        res.status(200).json({

            message:
                "Student login successful",

            token,

            student: {
                id: student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                gender: student.gender,
                dateOfBirth: student.dateOfBirth,
                className: student.className,
                admissionNumber:
                    student.admissionNumber,
                parentName: student.parentName,
                parentPhone: student.parentPhone,
                address: student.address,
                school: student.school
            }

        });

    } catch (error) {

        console.error(
            "STUDENT LOGIN ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


// =====================================================
// STUDENT DASHBOARD
// =====================================================

const getStudentDashboard =
    async (req, res) => {

        try {

            const studentId =
                req.student.studentId;

            const schoolId =
                req.student.schoolId;


            // -------------------------------------------------
            // STUDENT
            // -------------------------------------------------

            const student =
                await Student.findOne({
                    _id: studentId,
                    school: schoolId
                });


            if (!student) {

                return res.status(404).json({
                    message:
                        "Student account not found"
                });

            }


            // -------------------------------------------------
            // FEES
            // -------------------------------------------------

            const fees =
                await Fee.find({
                    student: studentId,
                    school: schoolId
                })
                .sort({
                    createdAt: -1
                });


            const totalFees =
                fees.reduce(
                    (sum, fee) =>
                        sum +
                        Number(
                            fee.totalFee ||
                            (
                                Number(
                                    fee.tuitionFee || 0
                                ) +
                                Number(
                                    fee.otherFees || 0
                                )
                            )
                        ),
                    0
                );


            const totalPaid =
                fees.reduce(
                    (sum, fee) =>
                        sum +
                        Number(
                            fee.amountPaid || 0
                        ),
                    0
                );


            const totalBalance =
                fees.reduce(
                    (sum, fee) =>
                        sum +
                        Number(
                            fee.balance ??
                            Math.max(
                                Number(
                                    fee.totalFee || 0
                                ) -
                                Number(
                                    fee.amountPaid || 0
                                ),
                                0
                            )
                        ),
                    0
                );


            // -------------------------------------------------
            // PAYMENTS
            // -------------------------------------------------

            const payments =
                await Payment.find({
                    student: studentId,
                    school: schoolId
                })
                .sort({
                    createdAt: -1
                })
                .limit(20);


            // -------------------------------------------------
            // RESULTS
            // -------------------------------------------------

            const results =
                await Result.find({
                    student: studentId,
                    school: schoolId
                })
                .populate(
                    "exam",
                    "examName term academicYear startDate endDate"
                )
                .populate(
                    "subject",
                    "subjectName subjectCode"
                )
                .sort({
                    createdAt: -1
                });


            // -------------------------------------------------
            // EXAMS
            // -------------------------------------------------

            const exams =
                await Exam.find({
                    school: schoolId
                })
                .sort({
                    startDate: -1
                });


            // -------------------------------------------------
            // RESULT SUMMARY
            // -------------------------------------------------

            let resultTotal = 0;
            let resultMarks = 0;


            results.forEach(result => {

                resultMarks +=
                    Number(
                        result.marksObtained || 0
                    );

                resultTotal +=
                    Number(
                        result.totalMarks || 0
                    );

            });


            const resultPercentage =
                resultTotal > 0
                    ? (
                        resultMarks /
                        resultTotal
                    ) * 100
                    : 0;


            // -------------------------------------------------
            // RESPONSE
            // -------------------------------------------------

            res.status(200).json({

                message:
                    "Student dashboard loaded",

                student: {
                    id: student._id,
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
                        student.address,
                    school:
                        student.school
                },

                finance: {

                    totalFees,

                    totalPaid,

                    totalBalance,

                    feeRecords:
                        fees.length,

                    paymentRecords:
                        payments.length

                },

                fees,

                payments,

                results,

                exams,

                resultSummary: {

                    totalMarks:
                        resultTotal,

                    marksObtained:
                        resultMarks,

                    percentage:
                        Number(
                            resultPercentage.toFixed(2)
                        )

                }

            });

        } catch (error) {

            console.error(
                "STUDENT DASHBOARD ERROR:",
                error
            );

            res.status(500).json({
                message: error.message
            });
        }
    };


// =====================================================
// STUDENT PROFILE
// =====================================================

const getStudentProfile =
    async (req, res) => {

        try {

            const student =
                await Student.findOne({
                    _id:
                        req.student.studentId,

                    school:
                        req.student.schoolId
                });


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
                "STUDENT PROFILE ERROR:",
                error
            );

            res.status(500).json({
                message: error.message
            });
        }
    };


module.exports = {

    studentLogin,

    getStudentDashboard,

    getStudentProfile

};