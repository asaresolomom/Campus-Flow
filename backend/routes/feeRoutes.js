const express = require("express");

const router =
    express.Router();


const protect =
    require("../middleware/authMiddleware");


const {
    addFee,
    getFees,
    getFeeById,
    updateFee,
    deleteFee
} =
    require("../controllers/feeController");


// ==========================================
// ADD FEE
// ==========================================

router.post(
    "/add",
    protect,
    addFee
);


// ==========================================
// GET ALL FEES
// ==========================================

router.get(
    "/all",
    protect,
    getFees
);


// ==========================================
// GET SINGLE FEE
// ==========================================

router.get(
    "/:id",
    protect,
    getFeeById
);


// ==========================================
// UPDATE FEE
// ==========================================

router.put(
    "/:id",
    protect,
    updateFee
);


// ==========================================
// DELETE FEE
// ==========================================

router.delete(
    "/:id",
    protect,
    deleteFee
);


module.exports = router;