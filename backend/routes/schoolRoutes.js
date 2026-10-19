const protect = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

const {
    registerSchool,
    loginSchool,
    getDashboard
} = require("../controllers/schoolController");


router.post("/register", registerSchool);

router.post("/login", loginSchool);

router.get("/dashboard", protect, getDashboard);



module.exports = router;