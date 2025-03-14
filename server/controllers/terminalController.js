const { fetchTerminals } = require("../services/management");
const { getStoreId } = require("./storeController");

/**
 * Get Available Terminals for the Store
 */
async function getTerminals() {
    const storeId = await getStoreId();
    console.log("storeId : ", storeId);
    if (!storeId) {
        return [];
    }
    return await fetchTerminals(storeId);
}

module.exports = { getTerminals };

