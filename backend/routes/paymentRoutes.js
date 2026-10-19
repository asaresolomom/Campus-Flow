const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const {
    createPayment,
    getPayments,
    getStudentPayments
} =
    require("../controllers/paymentController");


// =====================================================
// CREATE PAYMENT
// =====================================================

router.post(
    "/add",
    protect,
    createPayment
);


// =====================================================
// GET ALL PAYMENTS
// =====================================================

router.get(
    "/all",
    protect,
    getPayments
);


// =====================================================
// GET STUDENT PAYMENTS
// =====================================================

router.get(
    "/student/:studentId",
    protect,
    getStudentPayments
);


module.exports = router;