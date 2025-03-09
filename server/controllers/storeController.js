const { fetchStores } = require("../services/management");
const { ADYEN_STORE_REFERENCE } = require("../config");

/**
 * Get Store ID from Store Reference
 */
async function getStoreId() {
    try {
        console.log("Fetching Store ID for Reference:", ADYEN_STORE_REFERENCE);
        const stores = await fetchStores();
        const store = stores.find(s => s.reference === ADYEN_STORE_REFERENCE);
        return store ? store.id : null;
    } catch (error) {
        console.error("Error fetching store ID:", error);
        return null;
    }
}

module.exports = { getStoreId };

