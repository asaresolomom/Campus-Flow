const Fee = require("../models/Fee");
const Payment = require("../models/Payment");
const Student = require("../models/student");


// =====================================================
// GENERATE ADMISSION NUMBER
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
// ACTIVATE STUDENT AFTER 30% PAYMENT
// =====================================================

const activateStudentIfEligible = async (
    studentId,
    schoolId,
    totalFee,
    amountPaid
) => {

    const requiredAmount =
        Number(totalFee) * 0.30;


    const paid =
        Number(amountPaid) || 0;


    if (
        paid < requiredAmount
    ) {

        return {
            activated: false,
            admissionNumber: null,
            percentage:
                totalFee > 0
                    ? (paid / totalFee) * 100
                    : 0
        };

    }


    const student =
        await Student.findOne({
            _id: studentId,
            school: schoolId
        });


    if (!student) {

        return {
            activated: false,
            admissionNumber: null,
            percentage: 0
        };

    }


    // Already active

    if (
        student.isActive &&
        student.admissionNumber
    ) {

        return {
            activated: false,
            admissionNumber:
                student.admissionNumber,
            percentage:
                (paid / totalFee) * 100
        };

    }


    const admissionNumber =
        await generateAdmissionNumber(
            schoolId
        );


    student.admissionNumber =
        admissionNumber;


    student.isActive =
        true;


    await student.save();


    return {
        activated: true,
        admissionNumber,
        percentage:
            (paid / totalFee) * 100
    };

};


// =====================================================
// ADD FEE
// =====================================================

const addFee = async (req, res) => {

    try {

        const {
            student,
            academicYear,
            term,
            tuitionFee,
            otherFees,
            amountPaid
        } = req.body;


        // =================================================
        // VALIDATE STUDENT
        // =================================================

        if (!student) {

            return res.status(400).json({
                message:
                    "Please select a student"
            });

        }


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
        // VALIDATE ACADEMIC YEAR
        // =================================================

        if (!academicYear) {

            return res.status(400).json({
                message:
                    "Academic year is required"
            });

        }


        // =================================================
        // VALIDATE TERM
        // =================================================

        if (!term) {

            return res.status(400).json({
                message:
                    "Term is required"
            });

        }


        // =================================================
        // VALIDATE TUITION
        // =================================================

        if (
            tuitionFee === undefined ||
            tuitionFee === null ||
            tuitionFee === ""
        ) {

            return res.status(400).json({
                message:
                    "Tuition fee is required"
            });

        }


        // =================================================
        // CONVERT NUMBERS
        // =================================================

        const tuition =
            Number(tuitionFee) || 0;


        const other =
            Number(otherFees) || 0;


        const initialPayment =
            Number(amountPaid) || 0;


        // =================================================
        // VALIDATE NUMBERS
        // =================================================

        if (tuition < 0) {

            return res.status(400).json({
                message:
                    "Tuition fee cannot be negative"
            });

        }


        if (other < 0) {

            return res.status(400).json({
                message:
                    "Other fees cannot be negative"
            });

        }


        if (initialPayment < 0) {

            return res.status(400).json({
                message:
                    "Amount paid cannot be negative"
            });

        }


        // =================================================
        // CALCULATE TOTAL
        // =================================================

        const totalFee =
            tuition +
            other;


        if (totalFee <= 0) {

            return res.status(400).json({
                message:
                    "Total fee must be greater than 0"
            });

        }


        // =================================================
        // CHECK INITIAL PAYMENT
        // =================================================

        if (
            initialPayment >
            totalFee
        ) {

            return res.status(400).json({
                message:
                    "Amount paid cannot be greater than total fee"
            });

        }


        // =================================================
        // CALCULATE BALANCE
        // =================================================

        const balance =
            Math.max(
                totalFee -
                initialPayment,
                0
            );


        // =================================================
        // CALCULATE STATUS
        // =================================================

        let status =
            "Unpaid";


        if (
            initialPayment > 0 &&
            balance > 0
        ) {

            status =
                "Partial";

        }


        if (
            balance <= 0
        ) {

            status =
                "Paid";

        }


        // =================================================
        // CREATE FEE
        // =================================================

        const fee =
            await Fee.create({

                student:
                    studentRecord._id,

                school:
                    req.school.id,

                academicYear:
                    academicYear,

                term:
                    term,

                tuitionFee:
                    tuition,

                otherFees:
                    other,

                totalFee:
                    totalFee,

                amountPaid:
                    initialPayment,

                balance:
                    balance,

                status:
                    status

            });


        // =================================================
        // INITIAL PAYMENT RECORD
        // =================================================

        let payment =
            null;


        if (
            initialPayment > 0
        ) {

            const previousBalance =
                totalFee;


            const remainingBalance =
                Math.max(
                    totalFee -
                    initialPayment,
                    0
                );


            const receiptNumber =
                "REC-" +
                Date.now() +
                "-" +
                Math.floor(
                    1000 +
                    Math.random() * 9000
                );


            payment =
                await Payment.create({

                    student:
                        studentRecord._id,

                    fee:
                        fee._id,

                    amountPaid:
                        initialPayment,

                    previousBalance:
                        previousBalance,

                    balance:
                        remainingBalance,

                    paymentMethod:
                        "Cash",

                    receiptNumber:
                        receiptNumber,

                    school:
                        req.school.id

                });

        }


        // =================================================
        // CHECK 30%
        // =================================================

        const admissionResult =
            await activateStudentIfEligible(
                studentRecord._id,
                req.school.id,
                totalFee,
                initialPayment
            );


        // =================================================
        // POPULATE
        // =================================================

        await fee.populate(
            "student",
            "firstName lastName admissionNumber className isActive"
        );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success:
                true,

            message:
                admissionResult.activated

                    ? "Fee created successfully. Student has reached 30% and has been admitted."

                    : "Fee created successfully.",


            fee,

            payment,

            student: {

                id:
                    studentRecord._id,

                firstName:
                    studentRecord.firstName,

                lastName:
                    studentRecord.lastName,

                admissionNumber:
                    admissionResult.admissionNumber ||
                    studentRecord.admissionNumber,

                isActive:
                    admissionResult.activated ||
                    studentRecord.isActive

            },


            admission: {

                requiredPercentage:
                    30,

                requiredAmount:
                    totalFee * 0.30,

                amountPaid:
                    initialPayment,

                percentagePaid:
                    Number(
                        admissionResult.percentage.toFixed(2)
                    ),

                reachedThirtyPercent:
                    initialPayment >=
                    totalFee * 0.30,

                activated:
                    admissionResult.activated,

                admissionNumber:
                    admissionResult.admissionNumber

            }

        });


    } catch (error) {

        console.error(
            "ADD FEE ERROR:",
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
// GET ALL FEES
// =====================================================

const getFees = async (req, res) => {

    try {

        const fees =
            await Fee.find({
                school:
                    req.school.id
            })
            .populate(
                "student",
                "firstName lastName admissionNumber className isActive"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success:
                true,

            count:
                fees.length,

            fees

        });

    } catch (error) {

        console.error(
            "GET FEES ERROR:",
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
// GET SINGLE FEE
// =====================================================

const getFeeById = async (req, res) => {

    try {

        const fee =
            await Fee.findOne({

                _id:
                    req.params.id,

                school:
                    req.school.id

            })
            .populate(
                "student",
                "firstName lastName admissionNumber className isActive"
            );


        if (!fee) {

            return res.status(404).json({
                message:
                    "Fee record not found"
            });

        }


        return res.status(200).json({

            success:
                true,

            fee

        });

    } catch (error) {

        console.error(
            "GET FEE ERROR:",
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
// UPDATE FEE
// =====================================================

const updateFee = async (req, res) => {

    try {

        const {
            student,
            academicYear,
            term,
            tuitionFee,
            otherFees,
            amountPaid
        } = req.body;


        const fee =
            await Fee.findOne({

                _id:
                    req.params.id,

                school:
                    req.school.id

            });


        if (!fee) {

            return res.status(404).json({
                message:
                    "Fee record not found"
            });

        }


        // =================================================
        // UPDATE BASIC FIELDS
        // =================================================

        if (
            student !== undefined
        ) {

            const studentExists =
                await Student.findOne({
                    _id: student,
                    school: req.school.id
                });


            if (!studentExists) {

                return res.status(404).json({
                    message:
                        "Student not found"
                });

            }


            fee.student =
                student;

        }


        if (
            academicYear !== undefined
        ) {

            fee.academicYear =
                academicYear;

        }


        if (
            term !== undefined
        ) {

            fee.term =
                term;

        }


        if (
            tuitionFee !== undefined
        ) {

            fee.tuitionFee =
                Number(tuitionFee) || 0;

        }


        if (
            otherFees !== undefined
        ) {

            fee.otherFees =
                Number(otherFees) || 0;

        }


        // =================================================
        // HANDLE PAYMENT UPDATE
        // =================================================

        if (
            amountPaid !== undefined
        ) {

            const oldPaid =
                Number(
                    fee.amountPaid || 0
                );


            const newPaid =
                Number(amountPaid) || 0;


            if (
                newPaid < oldPaid
            ) {

                return res.status(400).json({

                    message:
                        "Amount paid cannot be reduced. Use payment records to manage payments."

                });

            }


            const additionalPayment =
                newPaid -
                oldPaid;


            fee.amountPaid =
                newPaid;


            // =============================================
            // CREATE PAYMENT RECORD
            // =============================================

            if (
                additionalPayment > 0
            ) {

                const totalFeeBeforePayment =
                    Number(
                        fee.tuitionFee || 0
                    ) +
                    Number(
                        fee.otherFees || 0
                    );


                const previousBalance =
                    Math.max(
                        totalFeeBeforePayment -
                        oldPaid,
                        0
                    );


                const remainingBalance =
                    Math.max(
                        totalFeeBeforePayment -
                        newPaid,
                        0
                    );


                const receiptNumber =
                    "REC-" +
                    Date.now() +
                    "-" +
                    Math.floor(
                        1000 +
                        Math.random() * 9000
                    );


                await Payment.create({

                    student:
                        fee.student,

                    fee:
                        fee._id,

                    amountPaid:
                        additionalPayment,

                    previousBalance:
                        previousBalance,

                    balance:
                        remainingBalance,

                    paymentMethod:
                        "Cash",

                    receiptNumber:
                        receiptNumber,

                    school:
                        req.school.id

                });

            }

        }


        // =================================================
        // RECALCULATE FEE
        // =================================================

        const newTotalFee =
            Number(
                fee.tuitionFee || 0
            ) +
            Number(
                fee.otherFees || 0
            );


        const newBalance =
            Math.max(
                newTotalFee -
                Number(fee.amountPaid || 0),
                0
            );


        fee.totalFee =
            newTotalFee;


        fee.balance =
            newBalance;


        // =================================================
        // UPDATE STATUS
        // =================================================

        if (
            fee.amountPaid <= 0
        ) {

            fee.status =
                "Unpaid";

        } else if (
            newBalance <= 0
        ) {

            fee.status =
                "Paid";

        } else {

            fee.status =
                "Partial";

        }


        // =================================================
        // SAVE
        // =================================================

        await fee.save();


        // =================================================
        // CHECK 30%
        // =================================================

        const admissionResult =
            await activateStudentIfEligible(
                fee.student,
                req.school.id,
                newTotalFee,
                fee.amountPaid
            );


        // =================================================
        // POPULATE
        // =================================================

        await fee.populate(
            "student",
            "firstName lastName admissionNumber className isActive"
        );


        return res.status(200).json({

            success:
                true,

            message:
                admissionResult.activated

                    ? "Fee updated successfully. Student has reached 30% and has been admitted."

                    : "Fee updated successfully.",


            fee,


            admission: {

                requiredPercentage:
                    30,

                requiredAmount:
                    newTotalFee * 0.30,

                amountPaid:
                    fee.amountPaid,

                percentagePaid:
                    newTotalFee > 0
                        ? Number(
                            (
                                fee.amountPaid /
                                newTotalFee *
                                100
                            ).toFixed(2)
                        )
                        : 0,

                reachedThirtyPercent:
                    fee.amountPaid >=
                    newTotalFee * 0.30,

                activated:
                    admissionResult.activated,

                admissionNumber:
                    admissionResult.admissionNumber

            }

        });

    } catch (error) {

        console.error(
            "UPDATE FEE ERROR:",
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
// DELETE FEE
// =====================================================

const deleteFee = async (req, res) => {

    try {

        const fee =
            await Fee.findOneAndDelete({

                _id:
                    req.params.id,

                school:
                    req.school.id

            });


        if (!fee) {

            return res.status(404).json({
                message:
                    "Fee record not found"
            });

        }


        // Delete payments belonging to fee

        await Payment.deleteMany({

            fee:
                fee._id,

            school:
                req.school.id

        });


        return res.status(200).json({

            success:
                true,

            message:
                "Fee and related payments deleted successfully"

        });

    } catch (error) {

        console.error(
            "DELETE FEE ERROR:",
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

    addFee,

    getFees,

    getFeeById,

    updateFee,

    deleteFee

};
