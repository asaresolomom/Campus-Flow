const School = require("../models/school");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Register School
const registerSchool = async (req, res) => {
    try {

        const {
            schoolName,
            schoolCode,
            email,
            phone,
            address,
            password
        } = req.body;

        // Check if email already exists
        const existingSchool = await School.findOne({ email });

        if (existingSchool) {
            return res.status(400).json({
                message: "School already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create school
        const school = await School.create({
            schoolName,
            schoolCode,
            email,
            phone,
            address,
            password: hashedPassword
        });

        res.status(201).json({
            message: "School registered successfully",
            school: {
                id: school._id,
                schoolName: school.schoolName,
                schoolCode: school.schoolCode,
                email: school.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Login School
const loginSchool = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Find school
        const school = await School.findOne({ email });

        if (!school) {
            return res.status(404).json({
                message: "School not found"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, school.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: school._id,
                email: school.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            school: {
                id: school._id,
                schoolName: school.schoolName,
                email: school.email,
                schoolCode: school.schoolCode
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getDashboard = async (req, res) => {
    try {
        const school = await School.findById(req.school.id).select("-password");

        if (!school) {
            return res.status(404).json({
                message: "School not found"
            });
        }

        res.status(200).json({
            message: "Welcome to your dashboard",
            school
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    registerSchool,
    loginSchool,
    getDashboard
};