const Student = require("../models/Student");

const sendWhatsAppMessage = async (req, res) => {
    try {

        const {
            studentId,
            message
        } = req.body;

        if (!studentId) {
            return res.status(400).json({
                message: "Student is required"
            });
        }

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        const student = await Student.findOne({
            _id: studentId,
            school: req.school.id
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (!student.parentPhone) {
            return res.status(400).json({
                message: "This student's parent has no phone number"
            });
        }

        // Clean Ghana phone number
        let phone = student.parentPhone
            .replace(/\s+/g, "")
            .replace(/-/g, "");

        if (phone.startsWith("0")) {
            phone = "233" + phone.substring(1);
        }

        if (phone.startsWith("+")) {
            phone = phone.substring(1);
        }

        // WhatsApp link
        const whatsappUrl =
            `https://wa.me/${phone}?text=${encodeURIComponent(
                message.trim()
            )}`;

        res.status(200).json({
            message: "WhatsApp message prepared successfully",
            parentName: student.parentName,
            phone,
            whatsappUrl
        });

    } catch (error) {

        console.error(
            "WHATSAPP ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    sendWhatsAppMessage
};