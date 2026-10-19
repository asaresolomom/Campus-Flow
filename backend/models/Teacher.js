const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },

        lastName: {
            type: String,
            required: true
        },

        gender: {
            type: String,
            enum: ["Male", "Female"],
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        phone: {
            type: String,
            required: true
        },

        subject: {
            type: String,
            required: true
        },

        qualification: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
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

module.exports = mongoose.model("Teacher", teacherSchema);