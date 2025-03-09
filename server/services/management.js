const axios = require("axios");
const { ADYEN_API_KEY, ADYEN_MERCHANT_ACCOUNT, ADYEN_BASE_URL } = require("../config");

/**
 * Fetch Store List from Adyen API
 */
async function fetchStores() {
    const url = `${ADYEN_BASE_URL}/merchants/${ADYEN_MERCHANT_ACCOUNT}/stores?pageSize=100`;
    console.log("Requesting stores from:", url);

    const response = await axios.get(url, {
        headers: {
            "x-api-key": ADYEN_API_KEY,
            "Content-Type": "application/json"
        }
    });

    return response.data.data;
}

/**
 * Fetch Terminals from Adyen API
 */
async function fetchTerminals(storeId) {
    const url = `${ADYEN_BASE_URL}/terminals`;
    console.log("Requesting terminals from:", url);

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

    return response.data.data.map(terminal => ({
        id: terminal.id,
        model: terminal.model,
        serialNumber: terminal.serialNumber
    }));
}

module.exports = { fetchStores, fetchTerminals };

