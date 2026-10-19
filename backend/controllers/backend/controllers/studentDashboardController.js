const Student = require("../models/student");
const Fee = require("../models/Fee");
const Payment = require("../models/Payment");
const Result = require("../models/Result");
const Attendance = require("../models/Attendance");


// =====================================================
// STUDENT DASHBOARD
// =====================================================

const getStudentDashboard = async (req, res) => {

    try {

        const studentId =
            req.student._id;


        // ===============================================
        // STUDENT
        // ===============================================

        const student =
            await Student.findById(
                studentId
            ).select("-password");


        if (!student) {

            return res.status(404).json({

                message:
                    "Student not found"

            });

        }


        // ===============================================
        // FEES
        // ===============================================

        const fees =
            await Fee.find({

                student:
                    studentId

            }).sort({

                createdAt: -1

            });


        // ===============================================
        // PAYMENTS
        // ===============================================

        const payments =
            await Payment.find({

                student:
                    studentId

            })

            .populate("fee")

            .sort({

                createdAt: -1

            });


        // ===============================================
        // RESULTS
        // ===============================================

        const results =
            await Result.find({

                student:
                    studentId

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


        // ===============================================
        // ATTENDANCE
        // ===============================================

        let attendance = [];

        try {

            attendance =
                await Attendance.find({

                    student:
                        studentId

                })

                .populate(
                    "subject",
                    "subjectName subjectCode"
                )

                .populate(
                    "class",
                    "className section"
                )

                .populate(
                    "teacher",
                    "firstName lastName"
                )

                .sort({

                    attendanceDate:
                        -1

                });

        } catch (attendanceError) {

            console.log(
                "Attendance loading error:",
                attendanceError.message
            );

        }


        // ===============================================
        // FEE SUMMARY
        // ===============================================

        let totalFees = 0;

        let totalPaid = 0;

        let totalBalance = 0;


        fees.forEach(fee => {

            totalFees += Number(
                fee.totalFee ||
                (
                    Number(
                        fee.tuitionFee || 0
                    ) +
                    Number(
                        fee.otherFees || 0
                    )
                )
            );

            totalPaid += Number(
                fee.amountPaid || 0
            );

            totalBalance += Number(
                fee.balance || 0
            );

        });


        // ===============================================
        // ATTENDANCE SUMMARY
        // ===============================================

        const attendanceSummary = {

            total:
                attendance.length,

            present:
                attendance.filter(
                    item =>
                        item.status === "Present"
                ).length,

            absent:
                attendance.filter(
                    item =>
                        item.status === "Absent"
                ).length,

            late:
                attendance.filter(
                    item =>
                        item.status === "Late"
                ).length,

            excused:
                attendance.filter(
                    item =>
                        item.status === "Excused"
                ).length

        };


        // ===============================================
        // RESPONSE
        // ===============================================

        res.status(200).json({

            message:
                "Student dashboard loaded",

            student,

            fees,

            payments,

            results,

            attendance,

            summary: {

                totalFees,

                totalPaid,

                totalBalance,

                feeRecords:
                    fees.length,

                paymentRecords:
                    payments.length,

                resultRecords:
                    results.length,

                attendance:
                    attendanceSummary

            }

        });

    } catch (error) {

        console.error(
            "STUDENT DASHBOARD ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Failed to load student dashboard",

            error:
                error.message

        });

    }

};


module.exports = {

    getStudentDashboard

};