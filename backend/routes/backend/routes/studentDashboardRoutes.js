const express = require("express");

const router =
    express.Router();

const {
    getStudentDashboard
} =
    require("../controllers/studentDashboardController");

const studentAuthMiddleware =
    require("../middleware/studentAuthMiddleware");


router.get(
    "/",
    studentAuthMiddleware,
    getStudentDashboard
);


module.exports = router;