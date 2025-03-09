require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 3000,
    ADYEN_API_KEY: process.env.ADYEN_API_KEY,
    ADYEN_MERCHANT_ACCOUNT: process.env.ADYEN_MERCHANT_ACCOUNT,
    ADYEN_STORE_REFERENCE: process.env.ADYEN_STORE_REFERENCE,
    ADYEN_ENV: process.env.ADYEN_ENV || "test",
    ADYEN_BASE_URL: `https://management-${process.env.ADYEN_ENV || "live"}.adyen.com/v3`
};

