const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");


// =====================================================
// ADD STUDENT
// =====================================================

router.post(
    "/add",
    protect,
    addStudent
);


// =====================================================
// GET ALL STUDENTS
// =====================================================

router.get(
    "/all",
    protect,
    getStudents
);


// =====================================================
// GET SINGLE STUDENT
// =====================================================

router.get(
    "/:id",
    protect,
    getStudentById
);


// =====================================================
// UPDATE STUDENT
// =====================================================

router.put(
    "/:id",
    protect,
    updateStudent
);


// =====================================================
// DELETE STUDENT
// =====================================================

router.delete(
    "/:id",
    protect,
    deleteStudent
);


module.exports = router;