const express = require("express");
const { getTerminals } = require("./controllers/terminalController");
const { processPayment } = require("./services/payments");
const { ADYEN_MERCHANT_ACCOUNT, ADYEN_STORE_REFERENCE, ADYEN_ENV } = require("./config");

const router = express.Router();

// Get environment details
router.get("/api/getenv", (req, res) => {
    res.json({
        merchantAccount: ADYEN_MERCHANT_ACCOUNT,
        storeReference: ADYEN_STORE_REFERENCE,
        environment: ADYEN_ENV
    });
});

// Get available terminals
router.get("/api/terminals", async (req, res) => {
    try {
        const terminals = await getTerminals();
        res.json(terminals);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch terminals" });
    }
});

// Process payments
router.post("/api/payments", processPayment);

module.exports = router;

