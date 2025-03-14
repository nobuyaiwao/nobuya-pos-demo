const axios = require("axios");
const { ADYEN_API_KEY, ADYEN_MERCHANT_ACCOUNT, ADYEN_ENV } = require("../config");
const fs = require("fs");

const ADYEN_TERMINAL_API_URL = ADYEN_ENV === "live" 
    ? "https://terminal-api-live-us.adyen.com/sync"
    : "https://terminal-api-test.adyen.com/sync";

function getServiceID() {
    const now = new Date();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const MM2 = String(now.getMinutes()).padStart(2, '0');
    const SS = String(now.getSeconds()).padStart(2, '0');
    return `${MM}${DD}${HH}${MM2}${SS}`;
}

async function processPayment(req, res) {
    console.log("Received payment request", req.body);
    try {
        let { amount, currency, terminalId } = req.body;
        if (!amount || !currency || !terminalId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (ADYEN_ENV === "live") {
            console.log("Live environment detected, overriding amount to 100 JPY");
            amount = 100;
            currency = "JPY";
        }

        const paymentRequest = {
            SaleToPOIRequest: {
                MessageHeader: {
                    ProtocolVersion: "3.0",
                    MessageClass: "Service",
                    MessageCategory: "Payment",
                    MessageType: "Request",
                    SaleID: `POS-${Date.now()}`,
                    ServiceID: getServiceID(),
                    POIID: terminalId
                },
                PaymentRequest: {
                    SaleData: {
                        SaleTransactionID: {
                            TransactionID: `POS-${Date.now()}`,
                            TimeStamp: new Date().toISOString()
                        }
                    },
                    PaymentTransaction: {
                        AmountsReq: {
                            Currency: currency,
                            RequestedAmount: amount
                        }
                    }
                }
            }
        };

        console.log("Sending TAPI Request:", JSON.stringify(paymentRequest, null, 2));

        const response = await axios.post(ADYEN_TERMINAL_API_URL, paymentRequest, {
            headers: {
                "x-api-key": ADYEN_API_KEY,
                "Content-Type": "application/json"
            }
        });

        console.log("Payment response:", JSON.stringify(response.data, null, 2));

        if (response.data.SaleToPOIResponse?.PaymentResponse?.Response?.Result === "Success") {
            console.log("Payment successful, displaying virtual receipt...");

            const displayRequest = {
                SaleToPOIRequest: {
                    MessageHeader: {
                        ProtocolVersion: "3.0",
                        MessageClass: "Device",
                        MessageCategory: "Display",
                        MessageType: "Request",
                        SaleID: `POS-${Date.now()}`,
                        ServiceID: getServiceID(),
                        POIID: terminalId
                    },
                    DisplayRequest: {
                        DisplayOutput: [
                            {
                                Device: "CustomerDisplay",
                                InfoQualify: "Display",
                                OutputContent: {
                                    OutputFormat: "XML",  
                                    Text: generateVirtualReceiptXML(amount, currency, response.data.SaleToPOIResponse.PaymentResponse.POIData.POITransactionID.TransactionID, "Visa")
                                }
                            }
                        ]
                    }
                }
            };

            console.log("Sending Display Request:", JSON.stringify(displayRequest, null, 2));

            await axios.post(ADYEN_TERMINAL_API_URL, displayRequest, {
                headers: {
                    "x-api-key": ADYEN_API_KEY,
                    "Content-Type": "application/json"
                }
            });

            console.log("Virtual receipt displayed.");
        }

        res.json(response.data);
    } catch (error) {
        console.error("Payment processing error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Payment processing failed" });
    }
}

module.exports = { processPayment };

function generateVirtualReceiptXML(amount, currency, transactionId, cardType) {
    return `
    <?xml version="1.0" encoding="UTF-8"?>
    <Receipt>
        <Header>Adyen Virtual Receipt</Header>
        <Merchant>Adyen Japan</Merchant>
        <Date>${new Date().toISOString()}</Date>
        <Amount currency="${currency}">${amount}</Amount>
        <CardType>${cardType}</CardType>
        <TransactionID>${transactionId}</TransactionID>
        <Footer>Thank you for your purchase!</Footer>
    </Receipt>`;
}

