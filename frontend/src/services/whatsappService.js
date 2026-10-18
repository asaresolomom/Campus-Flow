const axios = require("axios");

/*
=====================================================
WHATSAPP CONFIGURATION
=====================================================
*/

const WHATSAPP_API_URL =
    process.env.WHATSAPP_API_URL;

const WHATSAPP_ACCESS_TOKEN =
    process.env.WHATSAPP_ACCESS_TOKEN;


/*
=====================================================
NORMALIZE GHANA PHONE NUMBER
=====================================================
*/

const normalizeGhanaPhone = (phone) => {

    if (!phone) {
        throw new Error(
            "Parent WhatsApp number is required"
        );
    }

    let number = String(phone)
        .trim()
        .replace(/\s+/g, "")
        .replace(/-/g, "");


    // 0241234567 -> 233241234567

    if (number.startsWith("0")) {

        number =
            "233" +
            number.substring(1);

    }


    // +233241234567 -> 233241234567

    if (number.startsWith("+")) {

        number =
            number.substring(1);

    }


    // Basic Ghana number validation

    if (
        !/^233\d{9}$/.test(number)
    ) {

        throw new Error(
            "Invalid Ghana WhatsApp number"
        );

    }


    return number;

};


/*
=====================================================
SEND WHATSAPP MESSAGE
=====================================================
*/

const sendWhatsAppMessage = async ({
    phone,
    message
}) => {

    try {

        if (!WHATSAPP_API_URL) {

            throw new Error(
                "WhatsApp API URL is not configured"
            );

        }


        if (!WHATSAPP_ACCESS_TOKEN) {

            throw new Error(
                "WhatsApp access token is not configured"
            );

        }


        if (!message) {

            throw new Error(
                "WhatsApp message is required"
            );

        }


        const recipient =
            normalizeGhanaPhone(phone);


        const response =
            await axios.post(

                WHATSAPP_API_URL,

                {
                    messaging_product:
                        "whatsapp",

                    recipient_type:
                        "individual",

                    to:
                        recipient,

                    type:
                        "text",

                    text: {
                        preview_url:
                            false,

                        body:
                            message
                    }
                },

                {
                    headers: {

                        Authorization:
                            `Bearer ${WHATSAPP_ACCESS_TOKEN}`,

                        "Content-Type":
                            "application/json"

                    }
                }

            );


        return {

            success: true,

            phone:
                recipient,

            messageId:
                response.data?.messages?.[0]?.id ||
                null,

            data:
                response.data

        };

    } catch (error) {

        console.error(
            "WHATSAPP SEND ERROR:",
            error.response?.data ||
            error.message
        );


        return {

            success: false,

            phone:
                phone,

            messageId:
                null,

            error:
                error.response?.data?.error?.message ||
                error.message

        };

    }

};


module.exports = {
    normalizeGhanaPhone,
    sendWhatsAppMessage
};