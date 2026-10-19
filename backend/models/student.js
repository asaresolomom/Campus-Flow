const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        gender: {
            type: String,
            enum: ["Male", "Female"],
            required: true
        },

        dateOfBirth: {
            type: Date,
            required: true
        },

        className: {
            type: String,
            required: true,
            trim: true
        },

        // ==========================================
        // GENERATED ONLY AFTER 30% PAYMENT
        // ==========================================

        admissionNumber: {
            type: String,
            unique: true,
            sparse: true,
            default: null
        },

        // ==========================================
        // FALSE = NOT YET ADMITTED
        // TRUE = 30% PAID AND ADMITTED
        // ==========================================

        isActive: {
            type: Boolean,
            default: false
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

        address: {
            type: String,
            required: true,
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
    mongoose.model("Student", studentSchema);
