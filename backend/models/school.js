const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema(
    {
        schoolName: {
            type: String,
            required: true
        },

        schoolCode: {
            type: String,
            required: true,
            unique: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
    type: String,
    required: true
},

        phone: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },

        logo: {
            type: String,
            default: ""
        },

        subscription: {
            type: String,
            default: "Free"
        }

    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model("School", schoolSchema);