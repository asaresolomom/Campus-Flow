const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createExam,
    getExams,
    getExamById,
    updateExam,
    deleteExam
} = require("../controllers/examController");


// Create Exam
router.post("/add", protect, createExam);


// Get All Exams
router.get("/all", protect, getExams);


// Get Exam By ID
router.get("/:id", protect, getExamById);

// Update Exam
router.put("/:id", protect, updateExam);

// Delete Exam
router.delete("/:id", protect, deleteExam);

module.exports = router;