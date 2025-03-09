require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const ADYEN_API_KEY = process.env.ADYEN_API_KEY;
const ADYEN_MERCHANT_ACCOUNT = process.env.ADYEN_MERCHANT_ACCOUNT;
const ADYEN_STORE_REFERENCE = process.env.ADYEN_STORE_REFERENCE;

console.log("Server starting...");
console.log("Merchant Account:", ADYEN_MERCHANT_ACCOUNT);
console.log("Store Reference:", ADYEN_STORE_REFERENCE);

/**
 * Store Reference to Store ID
 */
async function getStoreId(storeReference) {
    try {
        console.log("Fetching Store ID for Reference:", storeReference);
        console.log("Request Headers:", {
            "x-api-key": ADYEN_API_KEY ? "[HIDDEN]" : "NOT SET",
            "Content-Type": "application/json"
        });
        
        const url = `https://management-live.adyen.com/v3/merchants/${ADYEN_MERCHANT_ACCOUNT}/stores?pageSize=100`;
        console.log("Request URL:", url);

        const response = await axios.get(url, {
            headers: {
                "x-api-key": ADYEN_API_KEY,
                "Content-Type": "application/json"
            }
        });

        const stores = response.data.data;
        console.log("Fetched stores:", stores);
        
        const store = stores.find(s => s.reference === storeReference);
        console.log("Store ID found:", store ? store.id : "Not found");
        return store ? store.id : null;
    } catch (error) {
        console.error("Error fetching stores:", error.response ? error.response.data : error.message);
        return null;
    }
}

/**
 * Store ID to Terminals
 */
async function getTerminals(storeId) {
    try {
        console.log("Fetching terminals for Store ID:", storeId);
        console.log("Request Headers:", {
            "x-api-key": ADYEN_API_KEY ? "[HIDDEN]" : "NOT SET",
            "Content-Type": "application/json"
        });
        console.log("Request Params:", {
            merchantAccount: ADYEN_MERCHANT_ACCOUNT,
            storeIds: storeId
        });

        const response = await axios.get("https://management-live.adyen.com/v3/terminals", {
            headers: {
                "x-api-key": ADYEN_API_KEY,
                "Content-Type": "application/json"
            },
            params: {
                //merchantAccount: ADYEN_MERCHANT_ACCOUNT,
                storeIds: storeId,
                pageSize:100
            }
        });

        console.log("Terminals fetched:", response.data.data.length);
        return response.data.data.map(terminal => ({
            name: terminal.model,
            serialNumber: terminal.serialNumber
        }));
    } catch (error) {
        console.error("Error fetching terminals:", error.response ? error.response.data : error.message);
        return [];
    }
}

// API to expose Merchant Account and Store Reference
app.get("/api/getenv", (req, res) => {
    res.json({
        merchantAccount: ADYEN_MERCHANT_ACCOUNT,
        storeReference: ADYEN_STORE_REFERENCE
    });
});

/**
 * API for frontend: List Terminals
 */
app.get("/api/terminals", async (req, res) => {
    console.log("Received request for /api/terminals");
    try {
        // Store Reference to Store ID
        const storeId = await getStoreId(ADYEN_STORE_REFERENCE);
        if (!storeId) {
            console.log("Store not found for reference:", ADYEN_STORE_REFERENCE);
            return res.status(404).json({ error: "Store not found" });
        }

        // Store ID to Terminals
        const terminals = await getTerminals(storeId);
        res.json(terminals);
    } catch (error) {
        console.error("Failed to fetch terminals:", error);
        res.status(500).json({ error: "Failed to fetch terminals" });
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, "../src"), { extensions: ["html", "js", "css"] }));

// Root route
app.get("/", (req, res) => {
    console.log("Serving index.html");
    res.sendFile(path.join(__dirname, "../src/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

