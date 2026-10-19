const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addResult,
    getResults,
    getStudentResults,
    updateResult,
    deleteResult
} = require("../controllers/resultController");


// Add Result
router.post("/add", protect, addResult);


// Get All Results
router.get("/all", protect, getResults);


// Get Results By Student
router.get("/student/:studentId", protect, getStudentResults);

// Update Result
router.put("/:id", protect, updateResult);

// Delete Result
router.delete("/:id", protect, deleteResult);

module.exports = router;