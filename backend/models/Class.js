const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
    {
        className: {
            type: String,
            required: true
        },

        section: {
            type: String,
            required: true
        },

        academicYear: {
            type: String,
            required: true
        },

        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
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

module.exports = mongoose.model("Class", classSchema);