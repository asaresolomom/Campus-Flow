const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher
} = require("../controllers/teacherController");

// Add Teacher
router.post("/add", protect, addTeacher);

// Get All Teachers
router.get("/all", protect, getTeachers);

// Get Single Teacher
router.get("/:id", protect, getTeacherById);

// Update Teacher
router.put("/:id", protect, updateTeacher);

// Delete Teacher
router.delete("/:id", protect, deleteTeacher);

module.exports = router;