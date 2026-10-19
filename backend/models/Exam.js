const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
    {
        examName: {
            type: String,
            required: true
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

        academicYear: {
            type: String,
            required: true
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
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

module.exports = mongoose.model("Exam", examSchema);