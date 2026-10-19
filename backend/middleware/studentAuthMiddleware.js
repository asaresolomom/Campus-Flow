const jwt = require("jsonwebtoken");

const studentProtect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No student token provided"
            });
        }

        const parts = authHeader.split(" ");

        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        const token = parts[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (
            !decoded.studentId ||
            decoded.role !== "student"
        ) {
            return res.status(401).json({
                message: "Invalid student token"
            });
        }

        req.student = decoded;

        next();

    } catch (error) {
        console.error(
            "STUDENT AUTH ERROR:",
            error.message
        );

        return res.status(401).json({
            message: "Student session expired or invalid"
        });
    }
};

module.exports = studentProtect;