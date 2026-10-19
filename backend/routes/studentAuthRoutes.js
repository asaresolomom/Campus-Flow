const express = require("express");

const router = express.Router();

const {
    studentLogin,
    getStudentDashboard,
    getStudentProfile
} = require("../controllers/studentAuthController");

const studentProtect =
    require("../middleware/studentAuthMiddleware");


// =====================================================
// LOGIN
// =====================================================

router.post(
    "/login",
    studentLogin
);


// =====================================================
// DASHBOARD
// =====================================================

router.get(
    "/dashboard",
    studentProtect,
    getStudentDashboard
);


// =====================================================
// PROFILE
// =====================================================

router.get(
    "/profile",
    studentProtect,
    getStudentProfile
);


module.exports = router;