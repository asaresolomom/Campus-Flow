const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
    sendWhatsAppMessage
} = require("../controllers/whatsappController");

router.post(
    "/send",
    protect,
    sendWhatsAppMessage
);

module.exports = router;