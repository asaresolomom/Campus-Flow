const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    markAttendance,
    getAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance
} = require("../controllers/attendanceController");

// Mark Attendance
router.post("/add", protect, markAttendance);

// Get All Attendance
router.get("/all", protect, getAttendance);

// Get Attendance By ID
router.get("/:id", protect, getAttendanceById);

// Update Attendance
router.put("/:id", protect, updateAttendance);

// Delete Attendance
router.delete("/:id", protect, deleteAttendance);

module.exports = router;