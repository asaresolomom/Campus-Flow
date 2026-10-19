const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School",
            required: true
        },

        academicYear: {
            type: String,
            required: true,
            trim: true
        },

        term: {
            type: String,
            enum: [
                "First Term",
                "Second Term",
                "Third Term"
            ],
            required: true
        },

        tuitionFee: {
            type: Number,
            default: 0,
            min: 0
        },

        otherFees: {
            type: Number,
            default: 0,
            min: 0
        },

        totalFee: {
            type: Number,
            default: 0,
            min: 0
        },

        amountPaid: {
            type: Number,
            default: 0,
            min: 0
        },

        balance: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "Unpaid",
                "Partial",
                "Paid"
            ],
            default: "Unpaid"
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Fee", feeSchema);
