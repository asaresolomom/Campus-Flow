const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");


// Create Subject
router.post("/add", protect, createSubject);

// Get All Subjects
router.get("/all", protect, getSubjects);

// Get Subject By ID
router.get("/:id", protect, getSubjectById);

// Update Subject
router.put("/:id", protect, updateSubject);

// Delete Subject
router.delete("/:id", protect, deleteSubject);  

module.exports = router;