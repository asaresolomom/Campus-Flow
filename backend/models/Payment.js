const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        fee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fee",
            required: true
        },

        // Amount paid in this particular transaction
        amountPaid: {
            type: Number,
            required: true,
            min: 0
        },

        // Balance BEFORE this payment
        previousBalance: {
            type: Number,
            required: true,
            min: 0
        },

        // Balance AFTER this payment
        balance: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMethod: {
            type: String,
            required: true,
            trim: true
        },

        receiptNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Payment", paymentSchema);