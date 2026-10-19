const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
    {
        subjectName: {
            type: String,
            required: true
        },

        subjectCode: {
            type: String,
            required: true
        },

        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true
        },

        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
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

module.exports = mongoose.model("Subject", subjectSchema);