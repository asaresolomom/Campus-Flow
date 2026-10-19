const Payment = require("../models/Payment");
const Fee = require("../models/Fee");
const Student = require("../models/student");


// =====================================================
// GENERATE UNIQUE ADMISSION NUMBER
// =====================================================

const generateAdmissionNumber = async (schoolId) => {

    const year = new Date().getFullYear();

    let number =
        await Student.countDocuments({
            school: schoolId,
            isActive: true
        }) + 1;


    let admissionNumber =
        `ADM-${year}-${String(number).padStart(4, "0")}`;


    let existing =
        await Student.findOne({
            admissionNumber
        });


    while (existing) {

        number++;

        admissionNumber =
            `ADM-${year}-${String(number).padStart(4, "0")}`;


        existing =
            await Student.findOne({
                admissionNumber
            });

    }


    return admissionNumber;
};


// =====================================================
// CREATE PAYMENT
// =====================================================

const createPayment = async (req, res) => {

    try {

        const {
            student,
            fee,
            amountPaid,
            paymentMethod
        } = req.body;


        // =================================================
        // VALIDATE STUDENT
        // =================================================

        if (!student) {

            return res.status(400).json({
                message:
                    "Student is required"
            });

        }


        // =================================================
        // VALIDATE FEE
        // =================================================

        if (!fee) {

            return res.status(400).json({
                message:
                    "Fee record is required"
            });

        }


        // =================================================
        // VALIDATE AMOUNT
        // =================================================

        const paymentAmount =
            Number(amountPaid);


        if (
            !Number.isFinite(paymentAmount) ||
            paymentAmount <= 0
        ) {

            return res.status(400).json({
                message:
                    "Payment amount must be greater than 0"
            });

        }


        // =================================================
        // FIND STUDENT
        // =================================================

        const studentRecord =
            await Student.findOne({
                _id: student,
                school: req.school.id
            });


        if (!studentRecord) {

            return res.status(404).json({
                message:
                    "Student not found"
            });

        }


        // =================================================
        // FIND FEE
        // =================================================

        const feeRecord =
            await Fee.findOne({
                _id: fee,
                school: req.school.id
            });


        if (!feeRecord) {

            return res.status(404).json({
                message:
                    "Fee record not found"
            });

        }


        // =================================================
        // CHECK FEE BELONGS TO STUDENT
        // =================================================

        if (
            feeRecord.student.toString() !==
            studentRecord._id.toString()
        ) {

            return res.status(400).json({
                message:
                    "This fee does not belong to this student"
            });

        }


        // =================================================
        // TOTAL FEE
        // =================================================

        const tuitionFee =
            Number(
                feeRecord.tuitionFee || 0
            );


        const otherFees =
            Number(
                feeRecord.otherFees || 0
            );


        let totalFee =
            Number(
                feeRecord.totalFee || 0
            );


        // If totalFee was not stored,
        // calculate it.

        if (totalFee <= 0) {

            totalFee =
                tuitionFee +
                otherFees;

        }


        if (totalFee <= 0) {

            return res.status(400).json({
                message:
                    "Total school fee must be greater than 0"
            });

        }


        // =================================================
        // CURRENT AMOUNT PAID
        // =================================================

        const currentPaid =
            Number(
                feeRecord.amountPaid || 0
            );


        // =================================================
        // CURRENT BALANCE
        // =================================================

        const previousBalance =
            Math.max(
                totalFee -
                currentPaid,
                0
            );


        // =================================================
        // ALREADY FULLY PAID
        // =================================================

        if (
            previousBalance <= 0
        ) {

            return res.status(400).json({
                message:
                    "This fee is already fully paid"
            });

        }


        // =================================================
        // PAYMENT CANNOT EXCEED BALANCE
        // =================================================

        if (
            paymentAmount >
            previousBalance
        ) {

            return res.status(400).json({

                message:
                    `Payment cannot be greater than the outstanding balance of GHS ${previousBalance.toFixed(2)}`

            });

        }


        // =================================================
        // NEW AMOUNT PAID
        // =================================================

        const newAmountPaid =
            currentPaid +
            paymentAmount;


        // =================================================
        // NEW BALANCE
        // =================================================

        const newBalance =
            Math.max(
                totalFee -
                newAmountPaid,
                0
            );


        // =================================================
        // FEE STATUS
        // =================================================

        let feeStatus =
            "Partial";


        if (
            newAmountPaid <= 0
        ) {

            feeStatus =
                "Unpaid";

        }


        if (
            newBalance <= 0
        ) {

            feeStatus =
                "Paid";

        }


        // =================================================
        // 30% CALCULATION
        // =================================================

        const requiredAmount =
            totalFee * 0.30;


        const paymentPercentage =
            (
                newAmountPaid /
                totalFee
            ) * 100;


        const reachedThirtyPercent =
            newAmountPaid >=
            requiredAmount;


        // =================================================
        // ACTIVATION VARIABLES
        // =================================================

        let studentActivated =
            false;


        let generatedAdmissionNumber =
            null;


        // =================================================
        // ACTIVATE STUDENT
        // =================================================

        if (
            reachedThirtyPercent &&
            !studentRecord.isActive
        ) {

            generatedAdmissionNumber =
                await generateAdmissionNumber(
                    req.school.id
                );


            studentRecord.admissionNumber =
                generatedAdmissionNumber;


            studentRecord.isActive =
                true;


            await studentRecord.save();


            studentActivated =
                true;

        }


        // =================================================
        // IF ALREADY ACTIVE
        // =================================================

        if (
            studentRecord.isActive &&
            studentRecord.admissionNumber
        ) {

            generatedAdmissionNumber =
                studentRecord.admissionNumber;

        }


        // =================================================
        // GENERATE RECEIPT
        // =================================================

        const receiptNumber =
            "REC-" +
            Date.now() +
            "-" +
            Math.floor(
                1000 +
                Math.random() * 9000
            );


        // =================================================
        // CREATE PAYMENT
        // =================================================

        const payment =
            await Payment.create({

                student:
                    studentRecord._id,

                fee:
                    feeRecord._id,

                amountPaid:
                    paymentAmount,

                previousBalance:
                    previousBalance,

                balance:
                    newBalance,

                paymentMethod:
                    paymentMethod ||
                    "Cash",

                receiptNumber:
                    receiptNumber,

                school:
                    req.school.id

            });


        // =================================================
        // UPDATE FEE
        // =================================================

        feeRecord.totalFee =
            totalFee;


        feeRecord.amountPaid =
            newAmountPaid;


        feeRecord.balance =
            newBalance;


        feeRecord.status =
            feeStatus;


        await feeRecord.save();


        // =================================================
        // POPULATE PAYMENT
        // =================================================

        await payment.populate(
            "student",
            "firstName lastName admissionNumber className isActive"
        );


        await payment.populate(
            "fee"
        );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success:
                true,

            message:
                studentActivated
                    ? "Payment recorded successfully. Student has been admitted."
                    : "Payment recorded successfully.",


            payment,


            student: {

                id:
                    studentRecord._id,

                firstName:
                    studentRecord.firstName,

                lastName:
                    studentRecord.lastName,

                admissionNumber:
                    studentRecord.admissionNumber,

                isActive:
                    studentRecord.isActive

            },


            studentActivated:
                studentActivated,


            generatedAdmissionNumber:
                generatedAdmissionNumber,


            admissionRequirement: {

                percentage:
                    Number(
                        paymentPercentage.toFixed(2)
                    ),

                requiredPercentage:
                    30,

                requiredAmount:
                    requiredAmount,

                totalPaid:
                    newAmountPaid,

                remainingToThirtyPercent:
                    Math.max(
                        requiredAmount -
                        newAmountPaid,
                        0
                    ),

                reached:
                    reachedThirtyPercent

            },


            fee: {

                totalFee:
                    feeRecord.totalFee,

                amountPaid:
                    feeRecord.amountPaid,

                balance:
                    feeRecord.balance,

                status:
                    feeRecord.status

            }

        });


    } catch (error) {

        console.error(
            "CREATE PAYMENT ERROR:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                error.message

        });

    }

};


// =====================================================
// GET ALL PAYMENTS
// =====================================================

const getPayments = async (req, res) => {

    try {

        const payments =
            await Payment.find({
                school:
                    req.school.id
            })
            .populate(
                "student",
                "firstName lastName admissionNumber className isActive"
            )
            .populate(
                "fee"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success:
                true,

            count:
                payments.length,

            payments

        });

    } catch (error) {

        console.error(
            "GET PAYMENTS ERROR:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                error.message

        });

    }

};


// =====================================================
// GET STUDENT PAYMENTS
// =====================================================

const getStudentPayments =
    async (req, res) => {

        try {

            const payments =
                await Payment.find({

                    student:
                        req.params.studentId,

                    school:
                        req.school.id

                })
                .populate(
                    "student",
                    "firstName lastName admissionNumber className isActive"
                )
                .populate(
                    "fee"
                )
                .sort({
                    createdAt: -1
                });


            return res.status(200).json({

                success:
                    true,

                count:
                    payments.length,

                payments

            });

        } catch (error) {

            console.error(
                "GET STUDENT PAYMENTS ERROR:",
                error
            );


            return res.status(500).json({

                success:
                    false,

                message:
                    error.message

            });

        }

    };


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createPayment,

    getPayments,

    getStudentPayments

};
