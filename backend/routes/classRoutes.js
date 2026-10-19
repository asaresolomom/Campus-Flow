const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass
} = require("../controllers/classController");


// Create Class
router.post("/add", protect, createClass);


// Get All Classes
router.get("/all", protect, getClasses);


// Get Single Class
router.get("/:id", protect, getClassById);

// Update Class
router.put("/:id", protect, updateClass);

// Delete Class
router.delete("/:id", protect, deleteClass);

module.exports = router;