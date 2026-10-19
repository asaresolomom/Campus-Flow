const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getReceipt
} = require("../controllers/receiptController");


// Generate Receipt
router.get("/:paymentId", protect, getReceipt);


module.exports = router;