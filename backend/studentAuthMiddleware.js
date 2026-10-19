const jwt = require("jsonwebtoken");
const Student = require("../models/student");

const studentAuthMiddleware = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No authorization token provided"
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const student = await Student.findById(
            decoded.studentId
        ).select("-password");

        if (!student) {
            return res.status(401).json({
                message: "Student account not found"
            });
        }

        if (!student.isActive) {
            return res.status(403).json({
                message: "Student account is inactive"
            });
        }

        req.student = student;

        next();

    } catch (error) {

        console.error(
            "STUDENT AUTH ERROR:",
            error
        );

        return res.status(401).json({
            message: "Invalid or expired student token"
        });
    }
};

module.exports = studentAuthMiddleware;