const Payment = require("../models/Payment");


// Generate Receipt
const getReceipt = async (req, res) => {

    try {

        const payment = await Payment.findOne({

            _id: req.params.paymentId,
            school: req.school.id

        })
        .populate("student", "firstName lastName admissionNumber")
        .populate("fee");


        if (!payment) {

            return res.status(404).json({

                message: "Payment not found"

            });

        }


        res.status(200).json({

            receipt: {

                receiptNumber: payment.receiptNumber,

                student: payment.student,

                amountPaid: payment.amountPaid,

                paymentMethod: payment.paymentMethod,

                paymentDate: payment.paymentDate,

                feeDetails: {

                    totalFee: payment.fee.totalFee,

                    amountPaid:
                    payment.fee.amountPaid,

                    balance:
                    payment.fee.balance,

                    status:
                    payment.fee.status

                }

            }

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



module.exports = {

    getReceipt

};