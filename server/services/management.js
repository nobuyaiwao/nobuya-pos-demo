const axios = require("axios");
const { ADYEN_API_KEY, ADYEN_MERCHANT_ACCOUNT, ADYEN_BASE_URL } = require("../config");

/**
 * Fetch Store List from Adyen API
 */
async function fetchStores() {
    const url = `${ADYEN_BASE_URL}/merchants/${ADYEN_MERCHANT_ACCOUNT}/stores?pageSize=100`;
    console.log("Requesting stores from:", url);

    try {
        const response = await axios.get(url, {
            headers: {
                "x-api-key": ADYEN_API_KEY,
                "Content-Type": "application/json"
            }
        });

        if (!response.data || !response.data.data) {
            console.error("Unexpected response format:", response.data);
            return [];
        }

        return response.data.data;
    } catch (error) {
        console.error("Error fetching stores:", error.response ? error.response.data : error.message);
        return [];
    }
}

/**
 * Fetch Terminals from Adyen API
 */
async function fetchTerminals(storeId) {
    const url = `${ADYEN_BASE_URL}/terminals`;
    console.log("Requesting terminals from:", url);

    try {
        const response = await axios.get(url, {
            headers: {
                "x-api-key": ADYEN_API_KEY,
                "Content-Type": "application/json"
            },
            params: {
                merchantAccount: ADYEN_MERCHANT_ACCOUNT,
                storeIds: storeId
            }
        });

        console.log("Full Response:", response.data);

        // レスポンスのチェック
        if (!response.data || !Array.isArray(response.data.data)) {
            console.error("Unexpected response format:", response.data);
            return [];
        }

        return response.data.data.map(terminal => ({
            id: terminal.id,
            model: terminal.model,
            serialNumber: terminal.serialNumber
        }));

    } catch (error) {
        console.error("Error fetching terminals:",
            error.response ? error.response.data : error.message);
        return [];
    }
}



module.exports = { fetchStores, fetchTerminals };

