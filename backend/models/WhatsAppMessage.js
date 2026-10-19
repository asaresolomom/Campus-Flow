const mongoose = require("mongoose");

const whatsappMessageSchema = new mongoose.Schema(
    {
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School",
            required: true
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        parentName: {
            type: String,
            required: true,
            trim: true
        },

        parentPhone: {
            type: String,
            required: true,
            trim: true
        },

        messageType: {
            type: String,
            enum: [
                "General",
                "Fee Reminder",
                "Payment Confirmation",
                "Balance Reminder",
                "Attendance Notice",
                "Announcement"
            ],
            default: "General"
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Sent",
                "Delivered",
                "Read",
                "Failed"
            ],
            default: "Pending"
        },

        whatsappMessageId: {
            type: String,
            default: null
        },

        errorMessage: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "WhatsAppMessage",
    whatsappMessageSchema
);