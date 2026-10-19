const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getStudentReport
} = require("../controllers/reportController");


// Generate Student Report Card
router.get(
    "/student/:studentId/:examId",
    protect,
    getStudentReport
);


module.exports = router;